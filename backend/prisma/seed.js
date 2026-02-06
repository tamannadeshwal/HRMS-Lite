import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const employees = await prisma.employee.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john.doe@company.com',
        department: 'Engineering',
        position: 'Senior Developer',
        joinDate: new Date('2023-01-15'),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        joinDate: new Date('2023-03-20'),
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@company.com',
        department: 'HR',
        position: 'HR Specialist',
        joinDate: new Date('2023-02-10'),
      },
      {
        name: 'Alice Williams',
        email: 'alice.williams@company.com',
        department: 'Engineering',
        position: 'Frontend Developer',
        joinDate: new Date('2023-04-05'),
      },
      {
        name: 'Charlie Brown',
        email: 'charlie.brown@company.com',
        department: 'Sales',
        position: 'Sales Executive',
        joinDate: new Date('2023-05-12'),
      },
    ],
  });

  console.log(`✅ Created ${employees.count} employees`);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.createMany({
    data: [
      { employeeId: 1, date: today, status: 'present', notes: 'On time' },
      { employeeId: 2, date: today, status: 'present', notes: null },
      { employeeId: 3, date: today, status: 'absent', notes: 'Sick leave' },
      { employeeId: 4, date: today, status: 'present', notes: null },
      { employeeId: 5, date: today, status: 'present', notes: null },
    ],
  });

  console.log(`✅ Created ${attendance.count} attendance records`);
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
