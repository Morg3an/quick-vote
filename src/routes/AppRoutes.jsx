import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import CreatePoll from '../pages/CreatePoll';
import PollView from '../pages/PollView';
import NotFound from '../pages/NotFound';
import PollList from '../pages/PollList';
import VoteResultPage from '../pages/VoteResultPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/create" element={<CreatePoll />} />
      <Route path="/polls" element={<PollList />} />
      <Route path="/poll/:id" element={<PollView />} />
      <Route path="/my-polls" element={<PollList showOnlyMine />} />
      <Route path="/poll/:id/results" element={<VoteResultPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;