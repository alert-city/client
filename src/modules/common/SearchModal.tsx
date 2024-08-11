// import * as React from "react";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
// import getPathName from "@/utils/getPathName";
// import ConfirmDelete from "@/components/search-users/ConfirmDeleteModel";
// import { DELETE_USERS } from "@/graphql/users";
// import { useMutation } from "@apollo/client";
// import { User, emptyUser } from "@/types/displayList";
// // import BaseForm from "@/components/common/Form/BaseForm";
//
// interface AddUserProps {
//   show: boolean;
//   handleClose: () => void;
//   operation: "add" | "edit" | "delete" | "reminderForSelection";
//   data?: User[];
// }
//
// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   //   width: 400,
//   bgcolor: "background.paper",
//   // border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: "10px",
// };
//
// const SearchModel: React.FC<AddUserProps> = ({
//   show,
//   handleClose,
//   operation,
//   data,
// }) => {
//   const pathName = getPathName();
//   const [deleteUsers] = useMutation(DELETE_USERS);
//   const [userData, setUserData] = React.useState<User>(emptyUser);
//
//   // console.log("operation: ", operation);
//   // console.log("pathName: ", pathName);
//
//   if (
//     (pathName === "/admin/users" || pathName === "/admin/users/search") &&
//     operation === "edit"
//   ) {
//     userData.id = data?.[0].id ?? "";
//     userData.name.firstName = data?.[0].name.firstName ?? "";
//     userData.name.lastName = data?.[0].name.lastName ?? "";
//     userData.dob = data?.[0].dob ?? new Date();
//     userData.contact.email = data?.[0].contact.email ?? "";
//     userData.contact.phone = data?.[0].contact.phone ?? "";
//     userData.address.houseNumber = data?.[0].address.houseNumber ?? "";
//     userData.address.street = data?.[0].address.street ?? "";
//     userData.address.suburb = data?.[0].address.suburb ?? "";
//     userData.address.city = data?.[0].address.city ?? "";
//     userData.address.state = data?.[0].address.state ?? "";
//     userData.address.country = data?.[0].address.country ?? "";
//     userData.address.postalCode = data?.[0].address.postalCode ?? "";
//     userData.account = data?.[0].account ?? "";
//     userData.role.userType = data?.[0].role.userType ?? "";
//   }
//
//   let message = "";
//   if (pathName === "/admin/users" || pathName === "/admin/users/search") {
//     message = "Do you want to delete the user you selected?";
//   }
//
//   const ids: string[] | undefined = data?.map((item) => item.id);
//
//   const handleDelete = async () => {
//     try {
//       if (pathName === "/admin/users" || pathName === "/admin/users/search") {
//         await deleteUsers({
//           variables: { id: ids },
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };
//
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     // console.log("submit");
//   };
//
//   let UserComponent: JSX.Element | null = null;
//   switch (operation) {
//     // case "add":
//     // case "edit":
//     //   UserComponent = (
//     //     <BaseForm
//     //       onAdd={setUserData}
//     //       operation={operation}
//     //       handleClose={handleClose}
//     //       data={userData}
//     //     />
//     //   );
//     //   break;
//     case "delete":
//       UserComponent = (
//         <ConfirmDelete
//           onDelete={handleDelete}
//           handleClose={handleClose}
//           message={message}
//         />
//       );
//       break;
//   }
//
//   return (
//     <Modal
//       open={show}
//       onClose={handleClose}
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//       className="rounded-lg"
//       sx={{ border: "2px solid yellow" }}
//     >
//       {
//         <Box sx={style}>
//           {(pathName === "/admin/users" ||
//             pathName === "/admin/users/search") &&
//             UserComponent}
//         </Box>
//       }
//     </Modal>
//   );
// };
//
// export default SearchModel;
