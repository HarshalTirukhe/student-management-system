import { type Request, type Response } from "express";

import * as studentService from "../services/student.service.js";
import { AppError } from "../utils/AppError.js";

export const getStudents = async (
    req: Request,
    res: Response
) => {
    const students = await studentService.getAllStudents();

    res.json(students);
};

export const getStudent = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const student = await studentService.getStudentById(id);

    if (!student) {
        throw new AppError("Student not found", 404);
    }

    res.json(student);
};

export const createStudent = async (
    req: Request,
    res: Response
) => {
    const {
        name,
        age,
        email,
        courseId,
    } = req.body;

    const student = await studentService.createStudent(
        name,
        age,
        email,
        courseId
    );

    res.status(201).json(student);
};

export const updateStudent = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    const {
        name,
        age,
        email,
        courseId,
    } = req.body;

    const student = await studentService.updateStudent(
        id,
        name,
        age,
        email,
        courseId
    );

    res.json(student);
};

export const deleteStudent = async (
    req: Request,
    res: Response
) => {
    const id = Number(req.params.id);

    await studentService.deleteStudent(id);

    res.json({
        message: "Student deleted successfully",
    });
};