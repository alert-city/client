// import Box from "@mui/material/Box";
// import TextField from "@mui/material/TextField";
// import { useEffect, useState } from "react";
// import LoadingButton from "@mui/lab/LoadingButton";
// import { useDispatch } from "react-redux";
// import { setUsersData } from "@/redux/usersData";
// // import { setCoursesData } from "@/app/redux/coursesData";
// import getPathName from "@/utils/getPathName";
// import { FIND_USERS } from "@/graphql/users";
// import { useApolloClient } from "@apollo/client";
//
// type InputBoxProps = {
//   condition?: string;
// };
//
// interface ApiResponse {
//   data: {
//     message: any[]; // 根据实际返回的数据类型调整
//   };
// }
//
// const InputBox: React.FC<InputBoxProps> = ({ condition }) => {
//   const [loading, setLoading] = useState(false);
//   const [conditionInInputBox, setConditionInInputBox] = useState<string>("");
//   const [inputValue, setInputValue] = useState<string>("");
//   const dispatch = useDispatch();
//   const pathName = getPathName();
//   const client = useApolloClient();
//
//   useEffect(() => {
//     // console.log("condition", condition);
//     if (condition) {
//       setConditionInInputBox(`by ${condition}`);
//     } else {
//       setConditionInInputBox("by All");
//     }
//   }, [condition]);
//
//   const handleSubmit = async () => {
//     setLoading(true);
//     let conditionVar = {};
//     if (condition && condition !== "") {
//       conditionVar = { [condition]: inputValue };
//     }
//
//     // console.log("pathName: ", pathName);
//
//     // console.log("conditionVar", conditionVar);
//
//     try {
//       if (pathName === "/admin/users" || pathName === "/admin/users/search") {
//         const { data } = await client.query({
//           query: FIND_USERS,
//           variables: { conditionVar },
//         });
//         dispatch(setUsersData(data.findAllUsers));
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   return (
//     <div className="flex items-center">
//       <Box component="form" className="w-full" noValidate autoComplete="off">
//         <TextField
//           id="outlined-textarea"
//           label={`search ${conditionInInputBox}`}
//           placeholder={`Type to Search ${conditionInInputBox} `}
//           multiline
//           className="w-full "
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//         />
//       </Box>
//       <div className="ml-2">
//         <LoadingButton
//           loading={loading}
//           variant="outlined"
//           onClick={handleSubmit}
//         >
//           Submit
//         </LoadingButton>
//       </div>
//     </div>
//   );
// };
//
// export default InputBox;
