import * as chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';
import nodemailer from 'nodemailer';

import User from '../models/User.js';
import Project from '../models/Project.js';

import {
    addProject,
    deleteProject,
    getProject,
    updateProject,
    updateMembers,
    removeMember,
    inviteProjectMember,
    verifyInvitation,
    getProjectMembers
} from '../controllers/projectController.js';

describe("Project Controller", () => {
    let req, res, next, sandbox;

    beforeEach(() => {
        req = { user: { id: 'userId' }, body: {}, params: {}, query: {}, app: { locals: {} } };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        next = sinon.stub();
        sandbox = sinon.createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("addProject", () => {
        it("should add a new project successfully", async () => {
            req.body = { title: "New Project" };
            const mockUser = { _id: 'userId', img: '', email: 'user@example.com', name: 'User', projects: [] };
            const mockProject = { _id: 'projectId' };

            sandbox.stub(User, 'findById').resolves(mockUser);
            sandbox.stub(Project.prototype, 'save').resolves(mockProject);
            sandbox.stub(User, 'findByIdAndUpdate').resolves();

            await addProject(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(mockProject)).to.be.true;
        });

        it("should return 404 if user is not found", async () => {
            sandbox.stub(User, 'findById').resolves(null);

            await addProject(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("User not found");
        });
    });

    describe("deleteProject", () => {
        it("should return 404 if project does not exist", async () => {
            req.params.id = 'nonExistentProjectId';
            sandbox.stub(Project, 'findById').resolves(null);
    
            await deleteProject(req, res, next);
    
            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("Project not found!");
        });
    });    

    describe("updateProject", () => {
        it("should update the project successfully if the user is an owner", async () => {
            req.params.id = 'projectId';
            req.body = { title: "Updated Project" };
            const project = { 
                _id: 'projectId', 
                members: [{ id: 'userId', access: 'Owner' }] 
            };

            sandbox.stub(Project, 'findById').resolves(project);
            sandbox.stub(Project, 'findByIdAndUpdate').resolves();

            await updateProject(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "Project has been updated..." })).to.be.true;
        });
    });

    describe("updateMembers", () => {
        it("should update project member access successfully", async () => {
            req.params.id = 'projectId';
            req.body = { id: 'memberId', access: 'Admin', role: 'Developer' };
            const project = { 
                _id: 'projectId', 
                members: [{ id: 'userId', access: 'Owner' }] 
            };

            sandbox.stub(Project, 'findById').resolves(project);
            sandbox.stub(Project, 'findByIdAndUpdate').resolves();

            await updateMembers(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "Member has been updated..." })).to.be.true;
        });

        it("should return 403 if user does not have permission to update members", async () => {
            req.params.id = 'projectId';
            req.body = { id: 'memberId' };
            const project = { 
                _id: 'projectId', 
                members: [{ id: 'otherUserId', access: 'Editor' }] 
            };

            sandbox.stub(Project, 'findById').resolves(project);

            await updateMembers(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("You can update only if you are a member of this project!");
        });
    });

    describe("removeMember", () => {
    
        it("should return 403 if user is not authorized", async () => {
            req.params.id = 'projectId';
            req.body = { id: 'memberId' };
            const project = { 
                _id: 'projectId', 
                members: [{ id: 'otherUserId', access: 'Editor' }] 
            };

            sandbox.stub(Project, 'findById').resolves(project);

            await removeMember(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("You can update only if you are a member of this project!");
        });
    });

    describe("inviteProjectMember", () => {
        it("should return 404 if user is not found", async () => {
            sandbox.stub(User, 'findById').resolves(null);

            await inviteProjectMember(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("User not found");
        });

        it("should return 404 if project is not found", async () => {
            const user = { _id: 'userId', name: "User", img: "userImg.jpg", email: "user@example.com" };
            sandbox.stub(User, 'findById').resolves(user);
            sandbox.stub(Project, 'findById').resolves(null);

            await inviteProjectMember(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("Project not found!");
        });

        it("should return 403 if user is not authorized to invite", async () => {
            req.params.id = 'projectId';
            req.body = { email: "invitee@example.com", id: 'inviteeId', role: 'Developer', access: 'Editor' };
            const user = { _id: 'userId', name: "User", img: "userImg.jpg", email: "user@example.com" };
            const project = { _id: 'projectId', title: "Test Project", members: [{ id: 'userId', access: 'Viewer' }] };
            sandbox.stub(User, 'findById').resolves(user);
            sandbox.stub(Project, 'findById').resolves(project);

            await inviteProjectMember(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("You are not allowed to invite members to this project!");
        });
    });

});

