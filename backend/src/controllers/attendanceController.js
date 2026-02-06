import prisma from '../utils/prisma.js';

export const getAllAttendance = async (req, res, next) => {
  try {
    const { employeeId, startDate, endDate, status } = req.query;

    const where = {};

    if (employeeId) {
      where.employeeId = parseInt(employeeId);
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate);
      }
      if (endDate) {
        where.date.lte = new Date(endDate);
      }
    }

    if (status) {
      where.status = status;
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    res.json({
      success: true,
      data: attendance,
      count: attendance.length,
      filters: { employeeId, startDate, endDate, status },
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Attendance record not found',
      });
    }

    res.json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

export const createAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, status, notes } = req.body;

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Employee not found',
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: parseInt(employeeId),
        date: attendanceDate,
        status,
        notes: notes || null,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: attendance,
      message: 'Attendance record created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date, status, notes } = req.body;

    const updateData = {};
    if (date !== undefined) {
      const attendanceDate = new Date(date);
      attendanceDate.setHours(0, 0, 0, 0);
      updateData.date = attendanceDate;
    }
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes || null;

    const attendance = await prisma.attendance.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: attendance,
      message: 'Attendance record updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.attendance.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: 'Attendance record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAttendanceStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const attendance = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const employeeStats = {};
    attendance.forEach(record => {
      const empId = record.employee.id;
      if (!employeeStats[empId]) {
        employeeStats[empId] = {
          id: empId,
          name: record.employee.name,
          total: 0,
          present: 0,
          absent: 0,
          leave: 0,
          halfDay: 0,
        };
      }
      employeeStats[empId].total++;
      if (record.status === 'present') employeeStats[empId].present++;
      else if (record.status === 'absent') employeeStats[empId].absent++;
      else if (record.status === 'leave') employeeStats[empId].leave++;
      else if (record.status === 'half-day') employeeStats[empId].halfDay++;
    });

    const stats = {
      overall: {
        total: attendance.length,
        present: attendance.filter(a => a.status === 'present').length,
        absent: attendance.filter(a => a.status === 'absent').length,
        leave: attendance.filter(a => a.status === 'leave').length,
        halfDay: attendance.filter(a => a.status === 'half-day').length,
      },
      byEmployee: Object.values(employeeStats),
    };

    res.json({
      success: true,
      data: stats,
      filters: { startDate, endDate },
    });
  } catch (error) {
    next(error);
  }
};
