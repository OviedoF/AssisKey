import { DataProvider } from "./src/context/dataContext";
import { NativeRouter } from 'react-router-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppRouter from './src/router/AppRouter';
import SnackbarComponent from './src/components/SnackbarComponent';
import { Dimensions, KeyboardAvoidingView, ScrollView } from "react-native";
import DangerModal from "./src/components/DangerModal";

export default function App() {
  return (
    <DataProvider>
      <NativeRouter>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <SafeAreaProvider>
              <AppRouter />
              <SnackbarComponent />
              <DangerModal />
          </SafeAreaProvider>
        </KeyboardAvoidingView>
      </NativeRouter>
    </DataProvider>
  );
}