// import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "@/redux/store";
// import { setSelectedDataInfo } from "@/redux/selectedDataInfo";
// import getPathName from "@/utils/getPathName";
// import { getRows, getColumns } from "@/utils/displayList";
// import { useEffect, useState } from "react";
// import { User } from "@/types/displayList";
//
// const UsersList: React.FC = () => {
//   const dispatch = useDispatch();
//   const usersData = useSelector((state: RootState) => state.usersData);
//   const [columns, setColumns] = useState<GridColDef[]>([]);
//   const [rows, setRows] = useState<any[]>([]);
//   // const coursesData = useSelector((state: RootState) => state.coursesData);
//   const pathName = getPathName();
//
//   useEffect(() => {
//     setColumns(getColumns(pathName));
//     setRows(getRows(pathName, usersData));
//   }, [usersData, pathName]);
//
//   const handleSelectionModelChange = (
//     newSelectionModel: GridRowSelectionModel
//   ) => {
//     let selectedData: any = [];
//     if (pathName === "/admin/users" || pathName === "/admin/users/search") {
//       selectedData = newSelectionModel.map((id) =>
//         usersData.find((user: User) => user.id === id)
//       );
//     }
//
//     // if (pathName === "/admin/courses" || pathName === "/admin/courses/search") {
//     //   selectedData = newSelectionModel.map((id) =>
//     //     coursesData.find((course: Course) => course._id === id)
//     //   );
//     // }
//
//     dispatch(setSelectedDataInfo(selectedData));
//     // console.log("selectedData:", selectedData);
//   };
//   //newSelectionModel指的是选中的行的id
//   //selectedUsers是选中的行的数据
//
//   return (
//     <DataGrid
//       rows={rows}
//       columns={columns}
//       initialState={{
//         pagination: {
//           paginationModel: { page: 0, pageSize: 15 },
//         },
//       }}
//       pageSizeOptions={[5, 10, 15, 20, 25]}
//       checkboxSelection
//       onRowSelectionModelChange={handleSelectionModelChange}
//     />
//   );
// };
//
// export default UsersList;
