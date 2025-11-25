import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const App = () => {
  const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>App</div>
    </ThemeProvider>
  );
};

export default App;
