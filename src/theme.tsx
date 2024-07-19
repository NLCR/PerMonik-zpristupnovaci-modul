import { createTheme } from '@mui/material/styles'
import { blue, green, grey, orange, red } from '@mui/material/colors'
import { csCZ, skSK } from '@mui/x-data-grid/locales'
// import { bgBG as pickersBgBG } from '@mui/x-date-pickers/locales';
import { csCZ as coreCsCZ, skSK as coreSkSK } from '@mui/material/locale'
import { dark } from '@mui/material/styles/createPalette'
import type {} from '@mui/x-date-pickers/themeAugmentation'
import type {} from '@mui/x-data-grid/themeAugmentation'
import type {} from '@mui/x-date-pickers/AdapterDayjs'

// A custom theme for this app
const theme = createTheme({
  // components: {
  //   MuiDatePicker: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: 'red',
  //       },
  //     },
  //   },
  //   MuiDataGrid: {
  //     styleOverrides: {
  //       root: {
  //         backgroundColor: 'red',
  //       },
  //     },
  //   },
  // },
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    grey,
    green,
    orange,
    dark,
    blue,
    red,
    csCZ,
    skSK,
    coreCsCZ,
    coreSkSK,
  },
})

export default theme
//
// Font Sizes
//
// The default font sizes in Mantine are defined in the fontSizes property, and they are:
//
//   xs: 0.75rem (12px)
// sm: 0.875rem (14px)
// md: 1rem (16px)
// lg: 1.25rem (20px)
// xl: 1.5rem (24px)
//
// Radius
//
// The default border radii in Mantine are defined in the radius property, and they are:
//
//   xs: 2px
// sm: 4px
// md: 8px
// lg: 16px
// xl: 32px
//
// Spacing
//
// The default spacing in Mantine is defined in the spacing property, and they are:
//
//   xs: 8px
// sm: 12px
// md: 16px
// lg: 24px
// xl: 32px
//
// Shadows
//
// The default shadow values in Mantine are defined in the shadows property, and they are:
//
//   xs: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)
// sm: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)
// md: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)
// lg: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)
// xl: 0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)
//
// Breakpoints
//
// The default breakpoints in Mantine are defined in the breakpoints property, and they are:
//
//   xs: 576px
// sm: 768px
// md: 992px
// lg: 1200px
// xl: 1400px
