import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import Teams from "../models/Teams.js";
import Project from "../models/Project.js";
import otpGenerator from 'otp-generator';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    port: 465,
    host: 'smtp.gmail.com'
});

// Utility function to update user teams
const updateUserTeams = async (userId, teamId) => {
    return User.findByIdAndUpdate(userId, { $push: { teams: teamId } }, { new: true });
};

// Utility function to check if user has required access
const hasAccess = (member, roles) => roles.includes(member.access);

// Utility function to send mail
const sendMail = (mailOptions, next) => {
    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            return next(err);
        }
    });
};

// Add a new team
export const addTeam = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found"));

    const newTeam = new Teams({ members: [{ id: user.id, role: "d", access: "Owner" }], ...req.body });
    try {
        const savedTeam = await newTeam.save();
        await updateUserTeams(user.id, savedTeam._id);
        res.status(200).json(savedTeam);
    } catch (err) {
        next(err);
    }
};

// Delete a team
export const deleteTeam = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));

        const userIsOwner = team.members.some(member => member.id.toString() === req.user.id && member.access === "Owner");
        if (!userIsOwner) return next(createError(403, "You are not allowed to delete this Team!"));

        await team.delete();
        await User.findByIdAndUpdate(req.user.id, { $pull: { teams: req.params.id } });

        for (const member of team.members) {
            await User.findByIdAndUpdate(member.id, { $pull: { teams: req.params.id } });
        }

        res.status(200).json("Team has been deleted...");
    } catch (err) {
        next(err);
    }
};

// Get a team by ID
export const getTeam = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id)
            .populate("members.id", "_id name email img")
            .populate({ path: "projects", populate: { path: "members.id", select: "_id name email" } });

        const userIsMember = team.members.some(member => member.id.id === req.user.id);
        if (!userIsMember) return next(createError(403, "You are not allowed to see this Team!"));

        res.status(200).json(team);
    } catch (err) {
        next(err);
    }
};

// Update a team
export const updateTeam = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));

        const userIsAuthorized = team.members.some(member => member.id.toString() === req.user.id && hasAccess(member, ["Owner", "Admin", "Editor"]));
        if (!userIsAuthorized) return next(createError(403, "You are not allowed to update this Team!"));

        const updatedTeam = await Teams.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedTeam);
    } catch (err) {
        next(err);
    }
};

// Update team members
export const updateMembers = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));

        const userIsAuthorized = team.members.some(member => member.id.toString() === req.user.id && hasAccess(member, ["Owner", "Admin", "Editor"]));
        if (!userIsAuthorized) return next(createError(403, "You are not allowed to update this Team!"));

        await Teams.findByIdAndUpdate(req.params.id, {
            $set: {
                "members.$[elem].access": req.body.access,
                "members.$[elem].role": req.body.role,
            },
        }, {
            arrayFilters: [{ "elem.id": req.body.id }],
            new: true,
        });

        res.status(200).json({ message: "Member has been updated..." });
    } catch (err) {
        next(err);
    }
};

// Remove a team member
export const removeMember = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));

        const userIsAuthorized = team.members.some(member => member.id.toString() === req.user.id && hasAccess(member, ["Owner", "Admin", "Editor"]));
        if (!userIsAuthorized) return next(createError(403, "You are not allowed to remove members from this Team!"));

        await Teams.findByIdAndUpdate(req.params.id, {
            $pull: { members: { id: req.body.id } },
        });

        await User.findByIdAndUpdate(req.body.id, { $pull: { teams: req.params.id } });
        res.status(200).json({ message: "Member has been removed..." });
    } catch (err) {
        next(err);
    }
};

// Add a project to a team
export const addTeamProject = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    if (!user) return next(createError(404, "User not found"));

    const newProject = new Project({ members: [{ id: user.id, role: "d", access: "Owner" }], ...req.body });
    try {
        const savedProject = await newProject.save();
        await updateUserTeams(user.id, savedProject._id);
        await Teams.findByIdAndUpdate(req.params.id, { $push: { projects: savedProject._id } });

        res.status(200).json(savedProject);
    } catch (err) {
        next(err);
    }
};

// Invite a member to a team
export const inviteTeamMember = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return next(createError(404, "User not found"));

        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));

        req.app.locals.CODE = otpGenerator.generate(8, {
            upperCaseAlphabets: true,
            specialChars: true,
            lowerCaseAlphabets: true,
            digits: true,
        });

        const link = `${process.env.URL}/team/invite/${req.app.locals.CODE}?teamid=${req.params.id}&userid=${req.body.id}&access=${req.body.access}&role=${req.body.role}`;

        const mailBody = `
        <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDHQMmI5x5qWbOrEuJuFWkSIBQoT_fFyoKOKYqOSoIvQ&s" alt="VEXA Logo" style="display: block; margin: 0 auto; max-width: 200px; margin-bottom: 20px;">
            <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">${team.name}</h1>
            <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                    <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Invitation to Join Team: ${team.name}</h2>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px; color: #666; margin-bottom: 20px;">Dear ${req.body.name},</p>
                    <p style="font-size: 16px; color: #666; margin-bottom: 20px;">You have been invited to join team <b>${team.name}</b> on VEXA by <b>${user.name}</b>. Please follow the link below to accept the invitation:</p>
                    <div style="text-align: center;">
                        <a href=${link} style="background-color: #854CE6; color: #FFF; text-decoration: none; font-size: 16px; font-weight: 500; padding: 10px 30px; border-radius: 5px;">Accept Invitation</a>
                    </div>
                    <p style="font-size: 16px; color: #666; margin-top: 30px;">Best regards,</p>
                    <p style="font-size: 16px; color: #666;">The VEXA Team</p>
                </div>
            </div>
        </div>`;

        const userIsAuthorized = team.members.some(member => member.id.toString() === req.user.id && hasAccess(member, ["Owner", "Admin", "Editor"]));
        if (!userIsAuthorized) {
            return next(createError(403, "You are not allowed to invite members to this project!"));
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: `Invitation to join team ${team.name}`,
            html: mailBody,
        };

        await sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent successfully" });
        
    } catch (err) {
        next(err);
    }
};

// Verify invitation and add to team member
export const verifyInvitationTeam = async (req, res, next) => {
    try {
        const { teamid, userid, access, role } = req.query;
        const code = req.params.code;

        if (code !== req.app.locals.CODE) {
            return res.status(400).json({ message: "Invalid Link - Link Expired!" });
        }

        req.app.locals.CODE = null;
        req.app.locals.resetSession = true;

        const team = await Teams.findById(teamid);
        if (!team) return next(createError(404, "Team not found!"));

        const user = await User.findById(userid);
        if (!user) return next(createError(404, "User not found"));

        const userAlreadyInTeam = team.members.some(member => member.id.toString() === user.id);
        if (userAlreadyInTeam) return next(createError(403, "You are already a member of this team!"));

        const newMember = { id: user.id, role: role, access: access };

        await Teams.findByIdAndUpdate(teamid, { $push: { members: newMember } }, { new: true });
        await updateUserTeams(userid, team.id);

        res.status(200).json({ message: "You have successfully joined the team!" });
    } catch (err) {
        next(err);
    }
};

// Get team members
export const getTeamMembers = async (req, res, next) => {
    try {
        const team = await Teams.findById(req.params.id);
        if (!team) return next(createError(404, "Team not found!"));
        res.status(200).json(team.members);
    } catch (err) {
        next(err);
    }
};
