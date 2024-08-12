// import React from "react";
// import CustomButton from "@/components/common/Button";
// import DeleteIcon from "@mui/icons-material/Delete";
// import AddIcon from "@mui/icons-material/Add";
// import Stack from "@mui/material/Stack";
// import EditIcon from "@mui/icons-material/Edit";
//
// interface SearchButtonsProps {
//   onEdit?: () => void;
//   onAdd?: () => void;
//   onDelete?: () => void;
// }
//
// const SearchButtons: React.FC<SearchButtonsProps> = ({
//   onEdit,
//   onAdd,
//   onDelete,
// }) => {
//   return (
//     <div>
//       <Stack direction="row" spacing={2}>
//         <CustomButton
//           className="w-[8rem]"
//           variant="contained"
//           startIcon={<AddIcon />}
//           onClick={onAdd}
//         >
//           Add
//         </CustomButton>
//         <CustomButton
//           className="w-[8rem]"
//           variant="contained"
//           startIcon={<EditIcon />}
//           onClick={onEdit}
//         >
//           Edit
//         </CustomButton>
//         <CustomButton
//           className="w-[8rem]"
//           variant="contained"
//           startIcon={<DeleteIcon />}
//           onClick={onDelete}
//         >
//           Delete
//         </CustomButton>
//       </Stack>
//     </div>
//   );
// };
//
// export default SearchButtons;
