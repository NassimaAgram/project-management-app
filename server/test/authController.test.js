import * as chai from 'chai';
const { expect } = chai;
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { signup, signin, generateOTP, verifyOTP, resetPassword } from '../controllers/authController.js';

describe("Auth Controller", () => {
    let req, res, next;

    beforeEach(() => {
        req = { body: {}, query: {}, app: { locals: {} } };
        res = { status: sinon.stub().returnsThis(), json: sinon.stub(), clearCookie: sinon.stub() };
        next = sinon.stub();

        // Stub bcrypt functions
        sinon.stub(bcrypt, "hashSync").returns("hashedPassword");
        sinon.stub(bcrypt, "compareSync").returns(true);
        
        // Stub JWT functions
        sinon.stub(jwt, "sign").returns("jsonwebtoken");

        // Mock email transport
        sinon.stub(nodemailer, "createTransport").returns({
            sendMail: sinon.stub().yields(null) // No error in sending email
        });
    });

    afterEach(() => {
        sinon.restore(); // Restore all stubs and mocks
    });

    describe("signup", () => {
        it("should register a new user and return a token", async () => {
            req.body = { email: "test@example.com", password: "Password123" };
    
            sinon.stub(User, 'findOne').resolves(null); // Ensure no user is found
            sinon.stub(User.prototype, 'save').resolves({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: "hashedPassword"
            });
    
            await signup(req, res, next);
    
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ token: "jsonwebtoken" })).to.be.true;
        });
    
        it("should return error if email is already in use", async () => {
            req.body = { email: "existing@example.com", password: "Password123" };
    
            sinon.stub(User, 'findOne').resolves({ email: req.body.email }); // Mock existing user
    
            await signup(req, res, next);
    
            expect(res.status.calledWith(409)).to.be.true;
            expect(res.json.calledWith({ message: "Email is already in use." })).to.be.true;
        });
    });

    describe("signin", () => {
        it("should sign in a user with valid credentials", async () => {
            req.body = { email: "test@example.com", password: "Password123" };

            sinon.stub(User, 'findOne').resolves({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: "hashedPassword",
                googleSignIn: false
            });

            await signin(req, res, next);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWithMatch({ token: "jsonwebtoken" })).to.be.true;
        });

        it("should return error if user is not found", async () => {
            req.body = { email: "nonexistent@example.com", password: "Password123" };

            sinon.stub(User, 'findOne').resolves(null); // No user found

            await signin(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("User not found");
        });
    });

    
    describe("verifyOTP", () => {
        it("should verify OTP successfully", async () => {
            req.query = { code: "123456" };
            req.app.locals.OTP = "123456";

            await verifyOTP(req, res, next);

            expect(req.app.locals.OTP).to.be.null;
            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({ message: "OTP verified" })).to.be.true;
        });

        it("should return error for incorrect OTP", async () => {
            req.query = { code: "654321" };
            req.app.locals.OTP = "123456";

            await verifyOTP(req, res, next);

            expect(next.called).to.be.true;
            expect(next.args[0][0].message).to.equal("Incorrect OTP");
        });
    });    
});    