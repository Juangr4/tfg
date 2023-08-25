import { dbClient } from "@/db";

const Dashboard = async () => {
  const users = await dbClient.query.users.findMany();
  return (
    <div>
      <h1>Here goes some graphs</h1>
      <h2>Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
