const { v4: uuidv4 } = require('uuid');

const users = [
  { id: 'u-100', email: 'alice@acme-corp.test', password: 'alice-demo-pw', tenantId: 'tenant-a', role: 'member' },
  { id: 'u-200', email: 'bob@globex-inc.test', password: 'bob-demo-pw', tenantId: 'tenant-b', role: 'member' }
];

const orders = new Map();

function seed() {
  orders.clear();
  const rows = [
    { tenantId: 'tenant-a', customer: 'Acme Retail', items: [{ sku: 'KB-01', qty: 4 }], total: 320.0 },
    { tenantId: 'tenant-a', customer: 'Acme Outlet', items: [{ sku: 'MS-07', qty: 10 }], total: 190.0 },
    { tenantId: 'tenant-b', customer: 'Globex Online', items: [{ sku: 'KB-01', qty: 2 }], total: 160.0 }
  ];
  rows.forEach((r, i) => {
    const id = `ord-${1001 + i}`;
    orders.set(id, { id, status: 'open', createdAt: new Date().toISOString(), ...r });
  });
}
seed();

module.exports = {
  findUserByEmail: (email) => users.find((u) => u.email === email),
  listOrders: (tenantId) => [...orders.values()].filter((o) => o.tenantId === tenantId),
  getOrder: (id) => orders.get(id) || null,
  createOrder: (data) => {
    const id = `ord-${uuidv4().slice(0, 6)}`;
    const order = { id, status: 'open', createdAt: new Date().toISOString(), ...data };
    orders.set(id, order);
    return order;
  },
  deleteOrder: (id) => orders.delete(id),
  seed
};
