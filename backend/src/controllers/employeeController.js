import prisma from '../utils/prisma.js';

export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        attendance: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    res.json({
      success: true,
      data: employees,
      count: employees.length,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        attendance: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Employee not found',
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const { name, email, department, position, joinDate } = req.body;

    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        department,
        position,
        joinDate: joinDate ? new Date(joinDate) : new Date(),
      },
    });

    res.status(201).json({
      success: true,
      data: employee,
      message: 'Employee created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, department, position, joinDate } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (department !== undefined) updateData.department = department;
    if (position !== undefined) updateData.position = position;
    if (joinDate !== undefined) updateData.joinDate = new Date(joinDate);

    const employee = await prisma.employee.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json({
      success: true,
      data: employee,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getEmployeeAttendanceStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(id) },
      include: {
        attendance: true,
      },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Employee not found',
      });
    }

    const stats = {
      total: employee.attendance.length,
      present: employee.attendance.filter(a => a.status === 'present').length,
      absent: employee.attendance.filter(a => a.status === 'absent').length,
      leave: employee.attendance.filter(a => a.status === 'leave').length,
      halfDay: employee.attendance.filter(a => a.status === 'half-day').length,
    };

    res.json({
      success: true,
      data: {
        employee: {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          department: employee.department,
          position: employee.position,
        },
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};
