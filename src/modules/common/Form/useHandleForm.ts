// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/redux/store";
// import { setUsersData } from "@/redux/usersData";
// // import {
// //   getUsersDataById,
// //   putUser,
// //   getUsersData,
// //   getAddress,
// // } from "@/api/users";
// import { User } from "@/types/displayList";
//
// interface UseHandleFormProps {
//   handleClose: () => void;
// }
//
// const useHandleForm = ({ handleClose }: UseHandleFormProps) => {
//   const [formData, setFormData] = useState<
//     Partial<User & { password?: string }>
//   >({});
//   const [inputValue, setInputValue] = useState<string>("");
//   const [options, setOptions] = useState<string[]>([]);
//   const [addressDetails, setAddressDetails] = useState<any>({});
//   const dispatch = useDispatch();
//   const selectedDataInfo = useSelector(
//     (state: RootState) => state.selectedDataInfo.selectedDataInfo
//   );
//
//   useEffect(() => {
//     if (selectedDataInfo.length > 0) {
//       const selectedDataId = selectedDataInfo[0]._id;
//       const getUserInfo = async () => {
//         try {
//           const response = await getUsersDataById(selectedDataId);
//           setFormData(response);
//         } catch (err) {
//           console.error(err);
//         }
//       };
//       getUserInfo();
//     }
//   }, [selectedDataInfo]);
//
//   const handleInputChange = async (
//     event: React.SyntheticEvent,
//     newInputValue: string
//   ) => {
//     setInputValue(newInputValue);
//     setFormData((prev) => ({ ...prev, address: newInputValue }));
//     if (newInputValue) {
//       const addressData = await getAddress(newInputValue);
//       const { formatted, addressDetails } = addressData;
//       setOptions(formatted);
//       setAddressDetails(addressDetails);
//     } else {
//       setOptions([]);
//       setAddressDetails([]);
//     }
//   };
//
//   const handleChange = (
//     e:
//       | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//       | SelectChangeEvent<string>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };
//
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//
//     const newUser = {
//       ...formData,
//       dob: formData.dob?.toISOString().split("T")[0],
//       address: {
//         houseNumber: addressDetails.housenumber || undefined,
//         street: addressDetails.street || undefined,
//         suburb: addressDetails.suburb || undefined,
//         city: addressDetails.city || undefined,
//         state: addressDetails.state || undefined,
//         country: addressDetails.country || undefined,
//         postalCode: addressDetails.postcode || undefined,
//       },
//     };
//
//     try {
//       await putUser(formData.id!, newUser);
//       const response = await getUsersData({
//         condition: "All Users",
//         inputValue: "",
//       });
//       dispatch(setUsersData(response?.data?.message ?? []));
//       handleClose();
//     } catch (err) {
//       console.error(err);
//     }
//   };
//
//   return {
//     formData,
//     inputValue,
//     options,
//     handleChange,
//     handleInputChange,
//     handleSubmit,
//   };
// };
//
// export default useHandleForm;
