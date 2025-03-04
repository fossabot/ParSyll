import * as React from 'react';
import { useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { removeJWTToken } from '../helper/jwt';
import ParsyllLogo from '../assets/ParsyllLogo.svg'
import { useUser } from '../hooks/useUser';


export default function DashboardAppBar({profilePic}) {
  const navigate = useNavigate()

  const {authed} = useUser()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          {authed? 
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              component={Link} to="/dashboard/courses"
            >
              <MenuIcon />
            </IconButton> : ""
          // <Typography variant="h6" component="div" onClick={()=>navigate("/")} className="cursor-pointer">
          //   Parsyll
          // </Typography>
          }
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={()=>navigate("/")} className="cursor-pointer">
            <img src={ParsyllLogo} alt="Parsyll" className='w-12'/>
          </Typography>
          {authed ?
          <Box sx={{display:'flex'}}>
            <Button color="inherit" sx={{mr:1}}
              component={Link} to="/dashboard/upload_pdf"> 
              Parse PDF 
            </Button>
            <Avatar alt="User" imgProps={{ referrerPolicy: "no-referrer" }} src={profilePic} 
            component={Link} to="/dashboard/profile"/>
          </Box>
          :
          <Box>
            <Button color="inherit" onClick={(e) => {e.preventDefault(); navigate("/login")}}> Login </Button>
          </Box>}
        </Toolbar>
      </AppBar>
    </Box>
  );
}