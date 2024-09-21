import { USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL, ROLE, ACCESS_TOKEN, ACCOUNT_TYPE, CAN_SHOW_SNACKBAR, LOGIN_TYPE } from '@/shared/constants/storage';

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
  PageLocal: ['profile', 'resetPassword', 'preferences', 'logout'],
  PageOAuth: ['profile', 'preferences', 'logout'],
};

const RemoveLocalStorage = {
  Item: [USERNAME, IS_FIRST_LOGIN, DISPLAY_NAME, ID, AVATAR_URL, CAN_SHOW_SNACKBAR, LOGIN_TYPE],
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
  {subject: "Natural Disasters", matter: "Fires", icon_name: "fires", t_key: "fires", light: "rgba(255, 153, 204, 0.5)", dark: "rgba(255, 153, 204, 0.8)"},
  {subject: "Natural Disasters", matter: "Earthquakes", icon_name: "earthquakes", t_key: "earthquakes", light: "rgba(153, 255, 204, 0.5)", dark: "rgba(153, 255, 204, 0.8)"},
  {subject: "Infrastructure Failures", matter: "Internet Disconnect", icon_name: "internet-disconnect", t_key: "internetDisconnect", light: "rgba(102, 204, 255, 0.5)", dark: "rgba(102, 204, 255, 0.8)"},
  {subject: "Infrastructure Failures", matter: "Water Supply Disruptions", icon_name: "water-supply-disruptions", t_key: "waterSupplyDisruptions", light: "rgba(255, 255, 0, 0.5)", dark: "rgba(255, 255, 0, 0.8)"},
];

const InvisibleEmergencies = [
  {subject: "Infrastructure Failures", matter: "Power Outages", icon_name: "power-outages", t_key: "powerOutages", light: "rgba(153, 255, 102, 0.5)", dark: "rgba(153, 255, 102, 0.8)"},
  {subject: "Security-Related Events", matter: "Civil Unrest", icon_name: "civil-unrest", t_key: "civilUnrest", light: "rgba(218, 112, 214, 0.5)", dark: "rgba(218, 112, 214, 0.8)"},
  {subject: "Natural Disasters", matter: "Cyclones", icon_name: "cyclones", t_key: "cyclones", light: "rgba(0, 191, 255, 0.5)", dark: "rgba(0, 191, 255, 0.8)"},
  {subject: "Natural Disasters", matter: "Floods", icon_name: "floods", t_key: "floods", light: "rgba(255, 0, 255, 0.5)", dark: "rgba(255, 0, 255, 0.8)"},
  {subject: "Security-Related Events", matter: "Terrorism", icon_name: "terrorism", t_key: "terrorism", light: "rgba(205, 92, 0, 0.5)", dark: "rgba(205, 92, 0, 0.8)"},
  {subject: "Natural Disasters", matter: "Tsunamis", icon_name: "tsunamis", t_key: "tsunamis", light: "rgba(222, 40, 70, 0.5)", dark: "rgba(222, 40, 70, 0.8)"},
  {subject: "Health-Related Emergencies", matter: "Pandemics", icon_name: "pandemics", t_key: "pandemics", light: "rgba(127, 201, 196, 0.5)", dark: "rgba(127, 201, 196, 0.8)"},
  {subject: "Health-Related Emergencies", matter: "Heatwaves", icon_name: "heatwaves", t_key: "heatwaves", light: "rgba(255, 105, 97, 0.5)", dark: "rgba(255, 105, 97, 0.8)"},
  {subject: "Human-Made Disasters", matter: "Industrial Accidents", icon_name: "industrial-accidents", t_key: "industrialAccidents", light: "rgba(237, 145, 73, 0.5)", dark: "rgba(237, 145, 73, 0.8)"},
  {subject: "Marine and Coastal Incidents", matter: "Marine Rescue", icon_name: "marine-rescue", t_key: "marineRescue", light: "rgba(135, 206, 235, 0.5)", dark: "rgba(135, 206, 235, 0.8)"},
  {subject: "Animal and Agricultural Emergencies", matter: "Livestock Disease Outbreaks", icon_name: "livestock-disease-outbreak", t_key: "livestockDiseaseOutbreaks", light: "rgba(204, 153, 255, 0.5)", dark: "rgba(204, 153, 255, 0.8)"},
  {subject: "Environmental and Ecological Events", matter: "Drought", icon_name: "drought", t_key: "drought", light: "rgba(102, 255, 204, 0.5)", dark: "rgba(102, 255, 204, 0.8)"}
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
