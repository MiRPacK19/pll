import List from './pages/List.js?a=1';
import Levels from './pages/LevelList.js?a=1';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Statistics from './pages/Statistics.js';

export default [
    { path: '/', component: List },
    { path: '/levels', component: Levels },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
    { path: '/statistics', component: Statistics },
];
