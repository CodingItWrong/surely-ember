import add from 'date-fns/add';
import sub from 'date-fns/sub';

export default function (server) {
  const now = new Date();

  server.create('todo', { name: 'Simple Todo' });
  server.create('todo', {
    name: 'Completed Today Todo',
    completedAt: sub(now, { hours: 1 }),
  });
  server.create('todo', {
    name: 'Completed Old Todo',
    completedAt: sub(now, { weeks: 1 }),
  });
  server.create('todo', {
    name: 'Deleted Todo',
    deletedAt: sub(now, { days: 1 }),
  });
  server.create('todo', {
    name: 'Yesterday Todo',
    deferredUntil: sub(now, { days: 1 }),
    deferredAt: sub(now, { days: 2 }),
  });
  server.create('todo', {
    name: 'Tomorrow Todo',
    deferredUntil: add(now, { days: 1 }),
    deferredAt: sub(now, { hours: 1 }),
  });
  server.create('todo', {
    name: 'Next Week Todo',
    deferredUntil: add(now, { weeks: 1 }),
    deferredAt: sub(now, { hours: 1 }),
  });
}
