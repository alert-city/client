// import Snackbar from "@mui/material/Snackbar";
// import Alert from "@mui/material/Alert";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
//
// type EditUsersButtonsProps = {
//   show: boolean;
//   handleClose: () => void;
// };
//
// const ReminderForSelection: React.FC<EditUsersButtonsProps> = ({
//   show,
//   handleClose,
// }) => {
//   const reminder = useSelector((state: RootState) => state.reminder.reminder);
//
//   // console.log("reminder:", reminder);
//
//   let message = "";
//   switch (reminder) {
//     case "row=0":
//       message = "Please select at least one row data!";
//       break;
//     case "row>1":
//       message = "Please select only one row data!";
//       break;
//     default:
//       message = "";
//       break;
//   }
//
//   return (
//     <div>
//       <Snackbar
//         open={show}
//         autoHideDuration={6000}
//         onClose={handleClose}
//         anchorOrigin={{ vertical: "top", horizontal: "center" }}
//       >
//         <Alert
//           onClose={handleClose}
//           severity="warning"
//           variant="filled"
//           sx={{ width: "100%" }}
//         >
//           {message}
//         </Alert>
//       </Snackbar>
//     </div>
//   );
// };
//
// export default ReminderForSelection;
