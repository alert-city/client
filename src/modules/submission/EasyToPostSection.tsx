import React, { useCallback, useMemo } from "react";
import { Box, Button, Typography, Collapse, FormControlLabel, Switch } from '@mui/material';
import Grid from "@mui/material/Grid2";
import { IndexConfig } from "@/routes";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IS_DARK } from "@/shared/constants/storage";

interface EasyToPostSectionProps {
  handleOpenDialog: (subject: string, matter: string, matter_t_key: string) => void;
  checked: boolean;
  handleChange: () => void;
};

const EasyToPostSection: React.FC<EasyToPostSectionProps> = React.memo(({
  handleOpenDialog, checked, handleChange
}) => {
  const t = useTranslations("EasyToPostSection");
  const router = useRouter();
  const isDark = useMemo(() => localStorage.getItem(IS_DARK) === "1", []);

  const getRandomColor = useCallback((isDark: boolean): string => {
    let color = 'rgba(';
    for (let i = 0; i < 3; i++) {
      color += Math.floor(Math.random() * 175) + 80;
      color += ',';
    }
    color += ` ${isDark ? 0.8 : 0.5})`;
    return color;
  }, []);

  const ButtonStyle = useMemo(() => ({
    height: "70px",
    width: "70px",
    borderRadius: "20px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
    color: "white",
    fontWeight: "bold",
    fontSize: { xs: "12px", sm: "14px", md: "16px" },
    textTransform: "none",
    padding: "12px",
    transition: "background-color 0.3s, transform 0.3s ease-in-out",
    backgroundSize: '50%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    marginBottom: 1,
    "&:hover": {
      backgroundColor: "rgba(225, 80, 0, 0.8)",
      transform: "scale(1.1)",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)"
    }
  }), []);

  return (
    <Box
      component="form"
      sx={{
        width: "100%",
        maxWidth: 800,
        border: "1px solid #ddd",
        borderRadius: "24px",
        boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
        padding: 4,
        fontFamily: "Poppins, sans-serif"
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%', mb: 6
        }}>
        <Tooltip title={t('return')} placement="right">
          <IconButton
            onClick={() => router.back()}
            sx={{ position: 'absolute' }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Typography
        variant='h4'
        gutterBottom
        mb={4}
        sx={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          color: isDark ? '#ccc' : '#333'
        }}
      >
        Easy To Post
      </Typography>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={1}
        columns={{ xs: 8, sm: 8, md: 16 }}
      >
        {IndexConfig.VisibleEmergencies.map(item => (
          <Grid
            key={item.matter}
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
            size={4}
            gap={1}
            mb={2}
            sx={{
              padding: "10px",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.05)"
              },
              textAlign: "center",
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                handleOpenDialog(item.subject, item.matter, item.t_key);
              }}
              sx={{
                ...ButtonStyle,
                backgroundColor: getRandomColor(isDark),
                backgroundImage: `url(/images/submission-icons/${item.icon_name}.svg)`,
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{ fontSize: "12px", fontFamily: "Poppins, sans-serif" }}
            >
              {t(item.t_key)}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Collapse in={checked} timeout={500}>
        <Grid container rowSpacing={2} columnSpacing={2} columns={{xs: 8, sm: 8, md: 16}}>
          {IndexConfig.InvisibleEmergencies.map(item => (
            <Grid
              key={item.matter}
              display="flex"
              flexDirection="column"
              justifyItems="center"
              alignItems="center"
              size={4}
              sx={{
                padding: "10px",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)"
                },
                textAlign: "center",
              }}
            >
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleOpenDialog(item.subject, item.matter, item.t_key)}
                sx={{
                  ...ButtonStyle,
                  backgroundColor: getRandomColor(isDark),
                  backgroundImage: `url(/images/submission-icons/${item.icon_name}.svg)`,
                }}
              />
              <Typography
                variant="subtitle2"
                sx={{ fontSize: "12px", fontFamily: "Poppins, sans-serif" }}
              >
                {t(item.t_key)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Collapse>

      <Box mt={2} display="flex" justifyContent="flex-end">
        <FormControlLabel
          control={<Switch checked={checked} onChange={handleChange} />}
          label={t("more")}
          sx={{ marginRight: "8px", fontFamily: "Poppins, sans-serif" }}
        />
      </Box>
    </Box>
  );
});

export default EasyToPostSection;