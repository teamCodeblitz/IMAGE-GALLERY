-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2024 at 02:47 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `image-gallery`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `image_id` int(255) NOT NULL,
  `comment` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `image_id`, `comment`, `date`) VALUES
(1, 10, 41, '123asd', ''),
(2, 12, 41, 'asdad', ''),
(3, 10, 41, 'hi', ''),
(4, 10, 41, 'adad', ''),
(5, 10, 41, 'ad', ''),
(6, 10, 41, 'dddd', ''),
(7, 10, 41, 'hey', ''),
(8, 10, 41, 'zup man kamusta', ''),
(9, 10, 41, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor i', ''),
(10, 10, 41, 'sa', '');

-- --------------------------------------------------------

--
-- Table structure for table `gallery`
--

CREATE TABLE `gallery` (
  `id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `images` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gallery`
--

INSERT INTO `gallery` (`id`, `user_id`, `email`, `images`, `description`, `date`) VALUES
(41, 10, 'mikedayandante@gmail.com', '6721e6bf8743e.png', '', '2024-10-30T07:56:47.470Z'),
(42, 10, 'mikedayandante@gmail.com', '6721e78c2b062.png', '', '2024-10-30T08:00:12.132Z'),
(43, 10, 'mikedayandante@gmail.com', '6721e79271ae2.png', '', '2024-10-30T08:00:18.388Z'),
(44, 10, 'mikedayandante@gmail.com', '6721e79b69d1f.png', '', '2024-10-30T08:00:27.388Z'),
(45, 10, 'mikedayandante@gmail.com', '6721e86d65fb9.png', '', '2024-10-30T08:03:57.365Z'),
(46, 10, 'mikedayandante@gmail.com', '6721eb49b2fb2.png', '', '2024-10-30T08:16:09.654Z'),
(47, 10, 'mikedayandante@gmail.com', '6721ef48c800e.png', '', '2024-10-30T08:33:12.761Z'),
(48, 10, 'mikedayandante@gmail.com', '6721f781b6a57.png', '', '2024-10-30T09:08:17.709Z'),
(49, 10, 'mikedayandante@gmail.com', '6721f7dbacb0f.png', '', '2024-10-30T09:09:47.637Z'),
(50, 10, 'mikedayandante@gmail.com', '6721f863f029c.png', '', '2024-10-30T09:12:03.909Z'),
(51, 10, 'mikedayandante@gmail.com', '6721f86e42887.png', '', '2024-10-30T09:12:14.229Z'),
(52, 10, 'mikedayandante@gmail.com', '6721f8786e287.png', '', '2024-10-30T09:12:24.405Z'),
(53, 10, 'mikedayandante@gmail.com', '6721f88219773.png', '', '2024-10-30T09:12:34.061Z'),
(54, 10, 'mikedayandante@gmail.com', '6721f88d7bd2e.png', '', '2024-10-30T09:12:45.461Z'),
(55, 10, 'mikedayandante@gmail.com', '6721f9654ba6c.png', '', '2024-10-30T09:16:21.270Z'),
(56, 10, 'mikedayandante@gmail.com', '6721f96bd131f.png', '', '2024-10-30T09:16:27.829Z'),
(57, 10, 'mikedayandante@gmail.com', '6721fb63c0bad.png', '', '2024-10-30T09:24:51.702Z'),
(58, 10, 'mikedayandante@gmail.com', '67223269a994e.png', 'the world is healing', '2024-10-30T13:19:37.584Z'),
(59, 10, 'mikedayandante@gmail.com', '6722390ec7ab0.png', '', '2024-10-30T13:47:58.748Z'),
(60, 10, 'mikedayandante@gmail.com', '6724b979d8ddd.png', '', '2024-11-01T11:20:25.874Z'),
(61, 10, 'mikedayandante@gmail.com', '6724dba7337e7.png', '', '2024-11-01T13:46:15.177Z');

-- --------------------------------------------------------

--
-- Table structure for table `reactions`
--

CREATE TABLE `reactions` (
  `id` int(255) NOT NULL,
  `user_id` int(255) NOT NULL,
  `image_id` int(255) NOT NULL,
  `react` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reactions`
--

INSERT INTO `reactions` (`id`, `user_id`, `image_id`, `react`) VALUES
(3, 12, 41, 1),
(5, 10, 43, 1),
(11, 10, 42, 1),
(13, 10, 45, 1),
(14, 10, 46, 1),
(15, 10, 47, 1),
(17, 10, 41, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `middleName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `firstName`, `middleName`, `lastName`, `password`, `avatar`) VALUES
(10, 'mikedayandante@gmail.com', 'Matthew', 'Dalaguit', 'Dayandante', '$2y$10$zdM3JbNvEOyFZN9dFu5acOiNKeOyW7Pic1dnIdETmVSHdUbRiUxHa', 'default.jpg'),
(11, 'princess@gmail.com', 'Princess', 'Dalaguit', 'Dayandante', '$2y$10$nnYqxfFElK2BeTHp4ikkVu0CSZpvqfERqAfdakQZxs/P8FyHfCPr2', 'default.jpg'),
(12, 'sam@gmail.com', 'Nandy', 'pogi', 'Nario', '$2y$10$JresxzyvvjSTg..7ZOZ5keSLUcKO1p26FPx0XylI/QUrLU/dqOr.2', 'default.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `reactions`
--
ALTER TABLE `reactions`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
