import * as chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';
import nodemailer from 'nodemailer';

import User from '../models/User.js';
import Teams from '../models/Teams.js';
import Project from '../models/Project.js';

import { 
    addTeam, 
    deleteTeam, 
    getTeam, 
    updateTeam, 
    updateMembers, 
    removeMember, 
    addTeamProject, 
    inviteTeamMember, 
    verifyInvitationTeam, 
    getTeamMembers 
} from '../controllers/teamsController.js';

describe("Team Controller", () => {
    let req, res, next, sandbox;

    beforeEach(() => {
        req = { user: { id: 'userId' }, body: {}, params: {}, query: {}, app: { locals: {} } };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
        next = sinon.stub();
        sandbox = sinon.createSandbox();

        // Mock nodemailer transporter
        sandbox.stub(nodemailer, 'createTransport').returns({
            sendMail: sandbox.stub().yields(null) // Simulate successful email sending
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("addTeam", () => {
        it("should add a new team successfully", async () => {
            req.user = { id: 'userId' };
            req.body = { name: "New Team" };

            const mockUser = { _id: 'userId', teams: [] };
            const mockTeam = { _id: 'teamId', members: [] };
            sandbox.stub(User, 'findById').resolves(mockUser);
            sandbox.stub(Teams.prototype, 'save').resolves(mockTeam);
            sandbox.stub(User, 'findByIdAndUpdate').resolves();

            await addTeam(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith(mockTeam)).to.be.true;
        });

        it("should return 404 if user is not found", async () => {
            sandbox.stub(User, 'findById').resolves(null);

            await addTeam(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("User not found");
        });
    });

    describe("deleteTeam", () => {
        it("should delete team successfully", async () => {
            req.params.id = 'teamId';
            const team = { 
                _id: 'teamId', 
                members: [{ id: 'userId', access: 'Owner' }],
                delete: sinon.stub().resolves() 
            };
            sandbox.stub(Teams, 'findById').resolves(team);
            sandbox.stub(User, 'findByIdAndUpdate').resolves();

            await deleteTeam(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith("Team has been deleted...")).to.be.true;
        });

        it("should return 403 if user is not the owner", async () => {
            req.params.id = 'teamId';
            const team = { 
                _id: 'teamId', 
                members: [{ id: 'otherUserId', access: 'Owner' }] 
            };
            sandbox.stub(Teams, 'findById').resolves(team);

            await deleteTeam(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("You are not allowed to delete this Team!");
        });
    });

    describe("inviteTeamMember", () => {
        it("should send an invitation email if user is authorized", async () => {
            req.params.id = 'teamId';
            req.body = { email: "invitee@example.com", id: 'inviteeId', role: 'Developer', access: 'Editor' };
            const team = { _id: 'teamId', members: [{ id: 'userId', access: 'Owner' }], name: "Test Team" };
            sandbox.stub(Teams, 'findById').resolves(team);
            sandbox.stub(User, 'findById').resolves({ _id: 'userId', name: "User" });

            await inviteTeamMember(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "Email sent successfully" })).to.be.true;
        });
    });

    describe("addTeamProject", () => {
        it("should return 404 if user is not found", async () => {
            sandbox.stub(User, 'findById').resolves(null);

            await addTeamProject(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("User not found");
        });
    });

    describe("verifyInvitationTeam", () => {
        it("should verify and add user to team if invitation is valid", async () => {
            req.query = { teamid: 'teamId', userid: 'userId', access: 'Editor', role: 'Developer' };
            req.params.code = 'validCode';
            req.app.locals.CODE = 'validCode';

            const team = { _id: 'teamId', members: [] };
            const user = { _id: 'userId' };
            sandbox.stub(Teams, 'findById').resolves(team);
            sandbox.stub(User, 'findById').resolves(user);
            sandbox.stub(Teams, 'findByIdAndUpdate').resolves();
            sandbox.stub(User, 'findByIdAndUpdate').resolves();

            await verifyInvitationTeam(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "You have successfully joined the team!" })).to.be.true;
        });

        it("should return 400 if invitation code is invalid", async () => {
            req.query = { teamid: 'teamId', userid: 'userId', access: 'Editor', role: 'Developer' };
            req.params.code = 'invalidCode';
            req.app.locals.CODE = 'validCode';

            await verifyInvitationTeam(req, res, next);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({ message: "Invalid Link - Link Expired!" })).to.be.true;
        });
    });
});
