import add from 'date-fns/add';
import sub from 'date-fns/sub';

export default function (server) {
  const now = new Date();

  // available
  server.create('todo', {
    name: 'Yesterday Todo',
    createdAt: sub(now, { days: 3 }),
    deferredUntil: sub(now, { days: 1 }),
    deferredAt: sub(now, { days: 2 }),
  });
  server.create('todo', {
    name: 'Simple Todo',
    createdAt: sub(now, { days: 1 }),
  });

  // completed
  server.create('todo', {
    name: 'Completed Old Todo',
    createdAt: sub(now, { weeks: 2 }),
    completedAt: sub(now, { weeks: 1 }),
  });
  server.create('todo', {
    name: 'Completed Today Todo',
    createdAt: sub(now, { days: 1 }),
    completedAt: sub(now, { hours: 1 }),
  });

  // deleted
  server.create('todo', {
    name: 'Deleted Old Todo',
    createdAt: sub(now, { weeks: 2 }),
    deletedAt: sub(now, { weeks: 1 }),
  });
  server.create('todo', {
    name: 'Deleted Todo',
    createdAt: sub(now, { days: 2 }),
    deletedAt: sub(now, { days: 1 }),
  });

  // future
  server.create('todo', {
    name: 'Next Week Todo',
    createdAt: sub(now, { days: 1 }),
    deferredUntil: add(now, { weeks: 1 }),
    deferredAt: sub(now, { hours: 1 }),
  });
  server.create('todo', {
    name: 'Tomorrow Todo',
    createdAt: sub(now, { days: 1 }),
    deferredUntil: add(now, { days: 1 }),
    deferredAt: sub(now, { hours: 1 }),
  });
}
