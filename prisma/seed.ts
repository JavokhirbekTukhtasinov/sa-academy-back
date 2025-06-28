import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.sa_user_lecture_progress.deleteMany();
  await prisma.sa_lecture_progress.deleteMany();
  await prisma.sa_lecture_files.deleteMany();
  await prisma.sa_lectures.deleteMany();
  await prisma.sa_sections.deleteMany();
  await prisma.sa_curriclum_attachments.deleteMany();
  await prisma.sa_curriclums.deleteMany();
  await prisma.sa_user_payments.deleteMany();
  await prisma.sa_user_feadbacks.deleteMany();
  await prisma.sa_user_courses.deleteMany();
  await prisma.sa_liked_courses.deleteMany();
  await prisma.sa_carts.deleteMany();
  await prisma.sa_courses.deleteMany();
  await prisma.sa_teacher_files.deleteMany();
  await prisma.sa_teachers.deleteMany();
  await prisma.sa_academy_images.deleteMany();
  await prisma.sa_academy_files.deleteMany();
  await prisma.sa_categories_on_academies.deleteMany();
  await prisma.sa_academies.deleteMany();
  await prisma.sa_sub_categories.deleteMany();
  await prisma.sa_categories.deleteMany();
  await prisma.sa_banners.deleteMany();
  await prisma.sa_admins.deleteMany();
  await prisma.sa_users.deleteMany();

  // Create admin
  console.log('👨‍💼 Creating admin...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.sa_admins.create({
    data: {
      first_name: 'Admin',
      last_name: 'User',
      full_name: 'Admin User',
      email: 'admin@sa-academy.com',
      password: hashedPassword,
    },
  });

  // Create categories
  console.log('📚 Creating categories...');
  const categories = await Promise.all([
    prisma.sa_categories.create({
      data: { name: 'Programming' },
    }),
    prisma.sa_categories.create({
      data: { name: 'Design' },
    }),
    prisma.sa_categories.create({
      data: { name: 'Business' },
    }),
    prisma.sa_categories.create({
      data: { name: 'Marketing' },
    }),
    prisma.sa_categories.create({
      data: { name: 'Language' },
    }),
  ]);

  // Create sub-categories
  console.log('📖 Creating sub-categories...');
  const subCategories = await Promise.all([
    prisma.sa_sub_categories.create({
      data: { name: 'JavaScript', parent_type_id: categories[0].id },
    }),
    prisma.sa_sub_categories.create({
      data: { name: 'Python', parent_type_id: categories[0].id },
    }),
    prisma.sa_sub_categories.create({
      data: { name: 'React', parent_type_id: categories[0].id },
    }),
    prisma.sa_sub_categories.create({
      data: { name: 'UI/UX Design', parent_type_id: categories[1].id },
    }),
    prisma.sa_sub_categories.create({
      data: { name: 'Graphic Design', parent_type_id: categories[1].id },
    }),
    prisma.sa_sub_categories.create({
      data: { name: 'Entrepreneurship', parent_type_id: categories[2].id },
    }),
    prisma.sa_sub_categories.create({
      data: { name: 'Digital Marketing', parent_type_id: categories[3].id },
    }),
    prisma.sa_sub_categories.create({
      data: { name: 'English', parent_type_id: categories[4].id },
    }),
  ]);

  // Create academies
  console.log('🏫 Creating academies...');
  const academies = await Promise.all([
    prisma.sa_academies.create({
      data: {
        name: 'Tech Academy',
        description: 'Leading technology education platform',
        status: 'CONFIRMED',
        location: '123 Tech Street, Silicon Valley',
        phone_number: '+1-555-0123',
        email: 'info@techacademy.com',
      },
    }),
    prisma.sa_academies.create({
      data: {
        name: 'Design Institute',
        description: 'Creative design education center',
        status: 'CONFIRMED',
        location: '456 Creative Ave, Design District',
        phone_number: '+1-555-0456',
        email: 'hello@designinstitute.com',
      },
    }),
    prisma.sa_academies.create({
      data: {
        name: 'Business School',
        description: 'Professional business education',
        status: 'CONFIRMED',
        location: '789 Business Blvd, Downtown',
        phone_number: '+1-555-0789',
        email: 'contact@businessschool.com',
      },
    }),
  ]);

  // Create users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    prisma.sa_users.create({
      data: {
        first_name: '',
        last_name: 'Doe',
        full_name: 'John Doe',
        email: 'test@gmail.com',
        password: await bcrypt.hash('asdfasdf', 10),
        is_verified: true,
        avatar: 'https://example.com/avatars/john.jpg',
      },
    }),
    prisma.sa_users.create({
      data: {
        first_name: 'Jane',
        last_name: 'Smith',
        full_name: 'Jane Smith',
        email: 'test2@test.com',
        password: await bcrypt.hash('password123', 10),
        is_verified: true,
        avatar: 'https://example.com/avatars/jane.jpg',
      },
    }),
    prisma.sa_users.create({
      data: {
        first_name: 'Mike',
        last_name: 'Johnson',
        full_name: 'Mike Johnson',
        email: 'test3@test.com',
        password: await bcrypt.hash('password123', 10),
        is_verified: true,
        avatar: 'https://example.com/avatars/mike.jpg',
      },
    }),
    prisma.sa_users.create({
      data: {
        first_name: 'Sarah',
        last_name: 'Wilson',
        full_name: 'Sarah Wilson',
          email: 'test4@test.com',
        password: await bcrypt.hash('password123', 10),
        is_verified: true,
        avatar: 'https://example.com/avatars/sarah.jpg',
      },
    }),
  ]);

  // Create teachers
  console.log('👨‍🏫 Creating teachers...');
  const teachers = await Promise.all([
    prisma.sa_teachers.create({
      data: {
        first_name: 'Dr. Alex',
        last_name: 'Chen',  
        full_name: 'Dr. Alex Chen',
        email: 'test5@test.com',
        academy_id: academies[0].id,
        user_id: users[0].id,
        description: 'Senior Software Engineer with 10+ years of experience in full-stack development',
        headline: 'Full-Stack Development Expert',
        website_url: 'https://alexchen.dev',
        instagram_url: 'https://instagram.com/alexchen',
        youtube_url: 'https://youtube.com/@alexchen',
        image: 'https://example.com/teachers/alex.jpg',
      },
    }),
    prisma.sa_teachers.create({
      data: {
        first_name: 'Prof. Maria',
        last_name: 'Garcia',
        full_name: 'Prof. Maria Garcia',
        email: 'test6@test.com',
        academy_id: academies[1].id,
        user_id: users[1].id,
        description: 'Award-winning UI/UX designer with expertise in modern design systems',
        headline: 'UI/UX Design Specialist',
        website_url: 'https://mariagarcia.design',
        instagram_url: 'https://instagram.com/mariagarcia',
        facebook_url: 'https://facebook.com/mariagarcia',
        image: 'https://example.com/teachers/maria.jpg',
      },
    }),
    prisma.sa_teachers.create({
      data: {
        first_name: 'Dr. Robert',
        last_name: 'Brown',
        full_name: 'Dr. Robert Brown',
        email: 'test7@test.com',
        academy_id: academies[2].id,
        user_id: users[2].id,
        description: 'Business consultant and entrepreneur with 15+ years of experience',
        headline: 'Business Strategy Expert',
        website_url: 'https://robertbrown.business',
        image: 'https://example.com/teachers/robert.jpg',
      },
    }),
  ]);

  // Create courses
  console.log('📚 Creating courses...');
  const courses = await Promise.all([
    prisma.sa_courses.create({
      data: {
        course_name: 'Complete JavaScript Masterclass',
        real_price: 99.99,
        sale_price: 79.99,
        teacher_id: teachers[0].id,
        user_id: users[0].id,
        academiy_id: academies[0].id,
        category_id: categories[0].id,
        description: 'Learn JavaScript from basics to advanced concepts with real-world projects',
        status: 'PUBLISHED',  
        is_live: true,
        what_student_learn: 'JavaScript fundamentals, ES6+, DOM manipulation, Async programming, Modern frameworks',
        requirements: 'Basic computer knowledge, No programming experience required',
        course_target_level: 'ALL',
        subtitle: 'From Zero to Hero in JavaScript Development',
        thumbnail: 'https://example.com/thumbnails/javascript-course.jpg',
      },
    }),
    prisma.sa_courses.create({
      data: {
        course_name: 'React.js Complete Guide',
        real_price: 129.99,
        sale_price: 99.99,
        teacher_id: teachers[0].id,
        user_id: users[0].id,
        academiy_id: academies[0].id,
        category_id: categories[0].id,
        description: 'Master React.js with hooks, context, and modern development practices',
        status: 'PUBLISHED',
        is_live: true,
        what_student_learn: 'React fundamentals, Hooks, Context API, State management, Component architecture',
        requirements: 'Basic JavaScript knowledge, Understanding of HTML and CSS',
        course_target_level: 'INTERMEDIATE',
        subtitle: 'Build Modern Web Applications with React',
        thumbnail: 'https://example.com/thumbnails/react-course.jpg',
      },
    }),
    prisma.sa_courses.create({
      data: {
        course_name: 'UI/UX Design Fundamentals',
        real_price: 149.99,
        sale_price: 119.99,
        teacher_id: teachers[1].id,
        user_id: users[1].id,
        academiy_id: academies[1].id,
        category_id: categories[1].id,
        description: 'Learn the principles of user interface and user experience design',
        status: 'PUBLISHED',
        is_live: true,
        what_student_learn: 'Design principles, User research, Wireframing, Prototyping, Design systems',
        requirements: 'No design experience required, Basic computer skills',
        course_target_level: 'ALL',
        subtitle: 'Create Beautiful and Functional User Interfaces',
        thumbnail: 'https://example.com/thumbnails/uiux-course.jpg',
      },
    }),
    prisma.sa_courses.create({
      data: {
        course_name: 'Digital Marketing Strategy',
        real_price: 89.99,
        sale_price: 69.99,
        teacher_id: teachers[2].id,
        user_id: users[2].id,
        academiy_id: academies[2].id,
        category_id: categories[3].id,
        description: 'Comprehensive guide to digital marketing strategies and tools',
        status: 'PUBLISHED',
        is_live: true,
        what_student_learn: 'SEO, Social media marketing, Content marketing, Email campaigns, Analytics',
        requirements: 'Basic internet knowledge, Interest in marketing',
        course_target_level: 'ALL',
        subtitle: 'Grow Your Business with Digital Marketing',
        thumbnail: 'https://example.com/thumbnails/marketing-course.jpg',
      },
    }),
    prisma.sa_courses.create({
      data: {
        course_name: 'Python for Data Science',
        real_price: 159.99,
        sale_price: 129.99,
        teacher_id: teachers[0].id,
        user_id: users[0].id,
        academiy_id: academies[0].id,
        category_id: categories[0].id,
        description: 'Learn Python programming for data analysis and machine learning',
        status: 'DRAFT',
        is_live: false,
        what_student_learn: 'Python basics, Data manipulation, Statistical analysis, Machine learning basics',
        requirements: 'Basic programming concepts, High school mathematics',
        course_target_level: 'INTERMEDIATE',
        subtitle: 'Data Science with Python',
        thumbnail: 'https://example.com/thumbnails/python-course.jpg',
      },
    }),
  ]);

  // Create sections
  console.log('📑 Creating sections...');
  const sections = await Promise.all([
    prisma.sa_sections.create({
      data: {
        name: 'Introduction to JavaScript',
        course_id: courses[0].id,
        order_num: 1,
      },
    }),
    prisma.sa_sections.create({
      data: {
        name: 'JavaScript Fundamentals',
        course_id: courses[0].id,
        order_num: 2,
      },
    }),
    prisma.sa_sections.create({
      data: {
        name: 'Advanced JavaScript Concepts',
        course_id: courses[0].id,
        order_num: 3,
      },
    }),
    prisma.sa_sections.create({
      data: {
        name: 'React Basics',
        course_id: courses[1].id,
        order_num: 1,
      },
    }),
    prisma.sa_sections.create({
      data: {
        name: 'React Hooks',
        course_id: courses[1].id,
        order_num: 2,
      },
    }),
  ]);

  // Create lectures
  console.log('🎥 Creating lectures...');
  const lectures = await Promise.all([
    prisma.sa_lectures.create({
      data: {
        name: 'What is JavaScript?',
        description: 'Introduction to JavaScript programming language',
        course_id: courses[0].id,
        lecture_main_video: 'https://example.com/videos/js-intro.mp4',
        is_public: true,
        order_num: 1,
      },
    }),
    prisma.sa_lectures.create({
      data: {
        name: 'Variables and Data Types',
        description: 'Learn about variables, strings, numbers, and booleans',
        course_id: courses[0].id,
        lecture_main_video: 'https://example.com/videos/js-variables.mp4',
        is_public: true,
        order_num: 2,
      },
    }),
    prisma.sa_lectures.create({
      data: {
        name: 'Functions in JavaScript',
        description: 'Understanding functions and their usage',
        course_id: courses[0].id,
        lecture_main_video: 'https://example.com/videos/js-functions.mp4',
        is_public: false,
        order_num: 3,
      },
    }),
    prisma.sa_lectures.create({
      data: {
        name: 'Introduction to React',
        description: 'What is React and why use it?',
        course_id: courses[1].id,
        lecture_main_video: 'https://example.com/videos/react-intro.mp4',
        is_public: true,
        order_num: 1,
      },
    }),
  ]);

  // Create curriculum
  console.log('📋 Creating curriculum...');
  const curriculums = await Promise.all([
    prisma.sa_curriclums.create({
      data: {
        title: 'JavaScript Fundamentals',
        description: 'Core concepts of JavaScript programming',
        section_id: sections[0].id,
        type: 'VIDEO',
        video_link: 'https://example.com/videos/js-fundamentals.mp4',
        order_num: 1,
      },
    }),
    prisma.sa_curriclums.create({
      data: {
        title: 'JavaScript Practice Exercises',
        description: 'Hands-on exercises to practice JavaScript',
        section_id: sections[1].id,
        type: 'ARTICLE',
        order_num: 2,
      },
    }),
  ]);

  // Create curriculum attachments
  console.log('📎 Creating curriculum attachments...');
  await Promise.all([
    prisma.sa_curriclum_attachments.create({
      data: {
        name: 'JavaScript Cheat Sheet',
        link_url: 'https://example.com/documents/js-cheatsheet.pdf',
        curriclum_id: curriculums[1].id,
        type: 'EXTERNAL_LINK',
      },
    }),
    prisma.sa_curriclum_attachments.create({
      data: {
        name: 'Practice Code Examples',
        link_url: 'https://example.com/documents/js-examples.zip',
        curriclum_id: curriculums[1].id,
        type: 'EXTERNAL_LINK',
      },
    }),
  ]);

  // Create user course enrollments
  console.log('👨‍🎓 Creating user course enrollments...');
  await Promise.all([
    prisma.sa_user_courses.create({
      data: {
        user_id: users[3].id,
        course_id: courses[0].id,
      },
    }),
    prisma.sa_user_courses.create({
      data: {
        user_id: users[3].id,
        course_id: courses[2].id,
      },
    }),
  ]);

  // Create user feedback
  console.log('💬 Creating user feedback...');
  await Promise.all([
    prisma.sa_user_feadbacks.create({
      data: {
        user_id: users[3].id,
        course_id: courses[0].id,
        content: 'Excellent course! The instructor explains concepts very clearly.',
        rate: 5,
      },
    }),
    prisma.sa_user_feadbacks.create({
      data: {
        user_id: users[3].id,
        course_id: courses[2].id,
        content: 'Great introduction to UI/UX design. Highly recommended!',
        rate: 4,
      },
    }),
  ]);

  // Create banners
  console.log('🖼️ Creating banners...');
  await Promise.all([
    prisma.sa_banners.create({
      data: {
        banner_link: '/courses/javascript-masterclass',
        image_desktop: 'https://example.com/banners/js-course-banner.jpg',
        created_by: admin.id,
      },
    }),
    prisma.sa_banners.create({
      data: {
        banner_link: '/workshops/uiux-design',
        image_desktop: 'https://example.com/banners/design-workshop-banner.jpg',
        created_by: admin.id,
      },
    }),
  ]);

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary of created data:');
  console.log(`- Admin: 1`);
  console.log(`- Categories: ${categories.length}`);
  console.log(`- Sub-categories: ${subCategories.length}`);
  console.log(`- Academies: ${academies.length}`);
  console.log(`- Users: ${users.length}`);
  console.log(`- Teachers: ${teachers.length}`);
  console.log(`- Courses: ${courses.length}`);
  console.log(`- Sections: ${sections.length}`);
  console.log(`- Lectures: ${lectures.length}`);
  console.log(`- Curriculum: ${curriculums.length}`);
  console.log(`- User enrollments: 2`);
  console.log(`- User feedback: 2`);
  console.log(`- Banners: 2`);

  console.log('\n🔑 Test credentials:');
  console.log('Admin: admin@sa-academy.com / admin123');
  console.log('User: john.doe@example.com / password123');
  console.log('User: jane.smith@example.com / password123');
  console.log('User: mike.johnson@example.com / password123');
  console.log('User: sarah.wilson@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 