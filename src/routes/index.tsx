import { USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL, ROLE,ACCESS_TOKEN,ACCOUNT_TYPE,CAN_SHOW_SNACKBAR } from '@/shared/constants/storage';

const Organization = {
  AccountType: 'Organization',
};

const Personal = {
  AccountType: 'Personal',
};

const SideBarAdmin = {
  Page: ['Dashboard', 'Review', 'Emergency', 'Routine', 'Staff'],
};

const SideBarPersonal = {
  Page: ['Dashboard', 'Emergency', 'Routine'],
};

const Setting = {
  Page: ['profile', 'resetPassword', 'preferences', 'logout'],
};

const RemoveLocalStorage = {
  Item: [USERNAME,IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL, CAN_SHOW_SNACKBAR],
};

const RemoveCookie = {
  Item: [ACCESS_TOKEN, ACCOUNT_TYPE, ROLE],
};

const languageOptions = [
  { code: 'AU', key: 'en' },
  { code: 'CN', key: 'zh-cn' },
];

const IconTheme = {
  Light: '/images/alertcity-light.png',
  Dark: '/images/alertcity-dark.png',
};

const VisibleEmergencies = [
  {subject: "Natural Disasters", matter: "Fires", icon_name: "fires", t_key: "fires"},
  {subject: "Natural Disasters", matter: "Earthquakes", icon_name: "earthquakes", t_key: "earthquakes"},
  {subject: "Infrastructure Failures", matter: "Internet Disconnect", icon_name: "internet-disconnect", t_key: "internetDisconnect"},
  {subject: "Infrastructure Failures", matter: "Water Supply Disruptions", icon_name: "water-supply-disruptions", t_key: "waterSupplyDisruptions"},
];

const InvisibleEmergencies = [
  {subject: "Infrastructure Failures", matter: "Power Outages", icon_name: "power-outages", t_key: "powerOutages"},
  {subject: "Security-Related Events", matter: "Civil Unrest", icon_name: "civil-unrest", t_key: "civilUnrest"},
  {subject: "Natural Disasters", matter: "Cyclones", icon_name: "cyclones", t_key: "cyclones"},
  {subject: "Natural Disasters", matter: "Floods", icon_name: "floods", t_key: "floods"},
  {subject: "Security-Related Events", matter: "Terrorism", icon_name: "terrorism", t_key: "terrorism"},
  {subject: "Natural Disasters", matter: "Tsunamis", icon_name: "tsunamis", t_key: "tsunamis"},
  {subject: "Health-Related Emergencies", matter: "Pandemics", icon_name: "pandemics", t_key: "pandemics"},
  {subject: "Health-Related Emergencies", matter: "Heatwaves", icon_name: "heatwaves", t_key: "heatwaves"},
  {subject: "Human-Made Disasters", matter: "Industrial Accidents", icon_name: "industrial-accidents", t_key: "industrialAccidents"},
  {subject: "Marine and Coastal Incidents", matter: "Marine Rescue", icon_name: "marine-rescue", t_key: "marineRescue"},
  {subject: "Animal and Agricultural Emergencies", matter: "Livestock Disease Outbreaks", icon_name: "livestock-disease-outbreak", t_key: "livestockDiseaseOutbreaks"},
  {subject: "Environmental and Ecological Events", matter: "Drought", icon_name: "drought", t_key: "drought"}
]

export const IndexConfig = {
  Organization,
  Personal,
  SideBarAdmin,
  SideBarPersonal,
  Setting,
  RemoveLocalStorage,
  languageOptions,
  IconTheme,
  RemoveCookie,
  VisibleEmergencies,
  InvisibleEmergencies
};
