import { AppProvider } from "@/app/AppProvider";
import { AppRoutes } from "@/routes/Routes";

const App = () => (
  <AppProvider>
    <AppRoutes />
  </AppProvider>
);

export default App;
