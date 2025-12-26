import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import {
  Ticket,
  TicketPriority,
  TicketStatus,
  TicketTopic,
} from './tickets/ticket.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [Ticket],
  synchronize: true,
});

const TOPICS = [
  TicketTopic.Billing,
  TicketTopic.Bug,
  TicketTopic.Feature,
  TicketTopic.Other,
];
const STATUSES = [
  TicketStatus.Created,
  TicketStatus.InProgress,
  TicketStatus.Completed,
];
const PRIORITIES = [
  TicketPriority.Low,
  TicketPriority.Medium,
  TicketPriority.High,
];

async function runSeed() {
  await AppDataSource.initialize();
  const ticketRepo = AppDataSource.getRepository(Ticket);

  console.log('🧹 Cleaning old tickets...');
  await ticketRepo.clear();

  const tickets: Ticket[] = [];

  for (let i = 0; i < 100; i++) {
    const requester_id = faker.number.int({ min: 1, max: 20 });
    let assignee_id: number | null =
      faker.number.int({ min: 0, max: 1 }) === 1
        ? faker.number.int({ min: 1, max: 20 })
        : null;

    let status = faker.helpers.arrayElement(STATUSES);

    // Enforce business rules: in_progress/completed must have assignee
    if (status === TicketStatus.InProgress && !assignee_id) {
      assignee_id = faker.number.int({ min: 1, max: 20 });
    }
    if (status === TicketStatus.Completed) {
      if (!assignee_id) {
        assignee_id = faker.number.int({ min: 1, max: 20 });
      }
    }
    if (status === TicketStatus.Created) {
      assignee_id = null;
    }

    tickets.push(
      ticketRepo.create({
        requester_id,
        assignee_id,
        topic: faker.helpers.arrayElement(TOPICS),
        priority: faker.helpers.arrayElement(PRIORITIES),
        status,
        description: faker.lorem.sentences(2),
      }),
    );
  }

  console.log('🚀 Inserting tickets...');
  await ticketRepo.save(tickets);

  console.log('✅ SEED DONE');
  process.exit();
}

runSeed().catch((err) => {
  console.error('❌ SEED FAILED');
  console.error(err);
  process.exit(1);
});
