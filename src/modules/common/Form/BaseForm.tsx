// import { Box, Typography, Paper, Stack } from "@mui/material";
// import Button from "@mui/material/Button";
// import { User } from "@/types/displayList";
// import CustomTextField from "@/components/common/TextField";
// import CustomSelect from "@/components/common/CustomSelect";
// import CustomAutocomplete from "@/components/common/Autocomplete";
// import useHandleForm from "@/components/common/Form/useHandleForm";
//
// const roleOptions = [
//   { value: "student", label: "Student" },
//   { value: "teacher", label: "Teacher" },
// ];
//
// interface NewAddUserFormProps {
//   handleClose: () => void;
//   operation: "add" | "edit";
//   data?: User;
//   onAdd?: (data: User) => void;
// }
//
// const BaseForm: React.FC<NewAddUserFormProps> = ({
//   handleClose,
//   operation,
//   data,
//   onAdd,
// }) => {
//   console.log("operation", operation);
//   console.log("data", data);
//   const {
//     formData,
//     inputValue,
//     options,
//     handleChange,
//     handleInputChange,
//     handleSubmit,
//   } = useHandleForm({ handleClose });
//
//   return (
//     <Box
//       component="form"
//       sx={{
//         "& .MuiTextField-root": { width: "100%" },
//       }}
//       className="w-[60rem]"
//       noValidate
//       autoComplete="off"
//       onSubmit={handleSubmit}
//     >
//       <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Basic Information
//         </Typography>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//           <CustomTextField
//             margin="none"
//             id="outlined-read-only-input"
//             required
//             label="First Name"
//             variant="outlined"
//             fullWidth
//             className="border-2 border-black-500"
//             onChange={handleChange}
//             value={formData.name?.firstName ?? ""}
//             InputProps={
//               operation === "add"
//                 ? undefined
//                 : { readOnly: true, sx: { backgroundColor: "#fff9c4" } }
//             }
//           />
//           <CustomTextField
//             margin="none"
//             id="outlined-read-only-input"
//             required
//             label="Last Name"
//             variant="outlined"
//             fullWidth
//             onChange={handleChange}
//             value={formData.name?.lastName ?? ""}
//             InputProps={
//               operation === "add"
//                 ? undefined
//                 : { readOnly: true, sx: { backgroundColor: "#fff9c4" } }
//             }
//           />
//
//           <CustomTextField
//             margin="none"
//             required
//             label="Date of Birth"
//             type="date"
//             variant="outlined"
//             InputLabelProps={{
//               shrink: true,
//             }}
//             fullWidth
//             onChange={handleChange}
//             value={formData.dob?.toISOString().split("T")[0] ?? ""}
//           />
//         </Box>
//       </Paper>
//
//       <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Account Information
//         </Typography>
//         <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
//           <Box className="flex items-center" sx={{ minWidth: 120 }}>
//             <CustomSelect
//               required
//               labelId="demo-simple-select-label"
//               id="demo-simple-select"
//               label="Role"
//               onChange={handleChange}
//               value={formData.role?.userType ?? ""}
//               inputProps={
//                 operation === "add"
//                   ? undefined
//                   : { readOnly: true, sx: { backgroundColor: "#fff9c4" } }
//               }
//               options={roleOptions}
//             />
//           </Box>
//           <CustomTextField
//             required
//             margin="none"
//             label="Account Name"
//             variant="outlined"
//             fullWidth
//             onChange={handleChange}
//             value={formData.account ?? ""}
//             InputProps={
//               operation === "add"
//                 ? undefined
//                 : { readOnly: true, sx: { backgroundColor: "#fff9c4" } }
//             }
//           />
//           {operation === "add" && (
//             <CustomTextField
//               margin="none"
//               required
//               label="Password"
//               variant="outlined"
//               fullWidth
//               onChange={handleChange}
//               value={formData.password ?? ""}
//             />
//           )}
//         </Box>
//       </Paper>
//
//       <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Contact Information
//         </Typography>
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             gap: 2,
//           }}
//         >
//           <CustomTextField
//             margin="none"
//             required
//             helperText="Starts with 0 or +61"
//             label="Phone Number"
//             variant="outlined"
//             fullWidth
//             onChange={handleChange}
//             value={formData.contact?.phone ?? ""}
//           />
//           <CustomTextField
//             margin="none"
//             required
//             label="Email"
//             type="email"
//             variant="outlined"
//             fullWidth
//             onChange={handleChange}
//             value={formData.contact?.email ?? ""}
//           />
//         </Box>
//       </Paper>
//
//       <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
//         <Typography variant="h6" gutterBottom>
//           Address Information
//         </Typography>
//         <Box className="flex items-center justify-center gap-2">
//           <Stack spacing={2} sx={{ width: "100%" }}>
//             {/*<CustomAutocomplete*/}
//             {/*  label="Search Address or Postal Code"*/}
//             {/*  value={formData.address ?? ""}*/}
//             {/*  inputValue={inputValue}*/}
//             {/*  onInputChange={handleInputChange}*/}
//             {/*  options={options}*/}
//             {/*/>*/}
//           </Stack>
//         </Box>
//       </Paper>
//       <Box className="flex gap-4 justify-end" sx={{ "& button": { m: 1 } }}>
//         <Button variant="contained" size="medium" onClick={handleClose}>
//           Cancel
//         </Button>
//         <Button variant="contained" size="medium" type="submit">
//           Submit
//         </Button>
//       </Box>
//     </Box>
//   );
// };
//
// export default BaseForm;
