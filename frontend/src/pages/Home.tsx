import Dashboard from "../components/Dashboard";
import TaskList from "../components/TaskList";

const Home = () => {
  return (
    <main style={{
      width: "100%",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }}>
      <Dashboard />
      <TaskList/>
    </main>
  );
};

export default Home;
