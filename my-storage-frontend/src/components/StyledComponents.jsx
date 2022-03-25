import { styled } from "@mui/system";

export const PageRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
}));

export const StyledFillInput = styled('input')(({theme})=>({
    position: 'absolute',
    width: '100%',
    inset: '0 0 0 0',
    opacity: '0',
    cursor: 'pointer',
}));

export const StyledImg = styled('img')(({theme})=>({
    borderRadius: '50%',
    width: '100%',
    aspectRatio: "1",
    objectFit: 'cover',
    border: `2px solid ${theme.palette.divider}`,
}));


