import { DataProvider } from "./src/context/dataContext";
import { NativeRouter } from 'react-router-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRouter from './src/router/AppRouter';
import SnackbarComponent from './src/components/SnackbarComponent';

export default function App() {
  return (
    <DataProvider>
      <NativeRouter>
        <SafeAreaProvider>
          <AppRouter />
          <SnackbarComponent />
        </SafeAreaProvider>
      </NativeRouter>
    </DataProvider>
  );
}