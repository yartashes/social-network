rs.initiate(
  {
    _id: 'sn',
    version: 1,
    members: [
      {
        _id: 1,
        host: 'mongo1:17017',
        priority: 2
      },
      {
        _id: 2,
        host: "mongo2:17018",
        priority: 1
      }
    ]
  },
  {
    force: true,
  }
);