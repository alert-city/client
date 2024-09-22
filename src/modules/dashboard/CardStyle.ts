export const CardStyle = {
    height: "250px",
    borderRadius: "24px",
    boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    overflow: "auto",
    "&:hover": {
        transform: 'translateY(-5px)',
        boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.2)',
    }
};