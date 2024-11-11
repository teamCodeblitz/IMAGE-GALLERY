-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 28, 2024 at 04:38 PM
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
(11, 10, 'mikedayandante@gmail.com', '671fabb6db256.png', '', '2024-10-28T15:20:22.843Z'),
(12, 10, 'mikedayandante@gmail.com', '671fac16a502b.png', '', '2024-10-28T15:21:58.626Z'),
(13, 10, 'mikedayandante@gmail.com', '671fac42b6131.png', '', '2024-10-28T15:22:42.673Z'),
(14, 11, 'princess@gmail.com', '671fac826efdd.png', '', '2024-10-28T15:23:46.401Z'),
(15, 10, 'mikedayandante@gmail.com', '671fad4c30889.png', '', '2024-10-28T15:27:08.138Z'),
(16, 10, 'mikedayandante@gmail.com', '671fad9b3efa3.png', '', '2024-10-28T15:28:27.185Z'),
(17, 10, 'mikedayandante@gmail.com', '671fae19dc689.png', '', '2024-10-28T15:30:33.817Z'),
(18, 10, 'mikedayandante@gmail.com', '671faefc2a551.png', '', '2024-10-28T15:34:20.137Z');

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
(11, 'princess@gmail.com', 'Princess', 'Dalaguit', 'Dayandante', '$2y$10$nnYqxfFElK2BeTHp4ikkVu0CSZpvqfERqAfdakQZxs/P8FyHfCPr2', 'default.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gallery`
--
ALTER TABLE `gallery`
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
-- AUTO_INCREMENT for table `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
