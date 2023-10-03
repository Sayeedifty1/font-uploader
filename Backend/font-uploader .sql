-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2023 at 04:21 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `font-uploader`
--

-- --------------------------------------------------------

--
-- Table structure for table `font-list`
--

CREATE TABLE `font-list` (
  `id` int(30) NOT NULL,
  `fonts` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`fonts`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `font_groups`
--

CREATE TABLE `font_groups` (
  `id` int(11) NOT NULL,
  `group_name` varchar(255) NOT NULL,
  `fonts` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `font_groups`
--

INSERT INTO `font_groups` (`id`, `group_name`, `fonts`) VALUES
(32, '1212321312', '[\"OpenSans-Bold.ttf\",\"times.ttf\",\"Debrosee-ALPnL.ttf\"]'),
(37, 'ifty', '[\"OpenSans-Bold.ttf\",\"Debrosee-ALPnL.ttf\"]'),
(38, 'Sifat\'s Font', '[\"Debrosee-ALPnL.ttf\",\"Debrosee-ALPnL.ttf\"]'),
(39, 'ifty\'s font', '[\"Debrosee-ALPnL.ttf\"]'),
(41, 'text2', '[\"times.ttf\",\"Baby Girly.ttf\"]'),
(42, 'text3', '[\"times.ttf\",\"Baby Girly.ttf\"]'),
(43, 'test ', '[\"OpenSans-Bold.ttf\"]'),
(47, 'test 2000', '[\"Baby Girly.ttf\"]'),
(48, 'test 404', '[\"times.ttf\"]');

-- --------------------------------------------------------

--
-- Table structure for table `uploaded_fonts`
--

CREATE TABLE `uploaded_fonts` (
  `id` int(11) NOT NULL,
  `font_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uploaded_fonts`
--

INSERT INTO `uploaded_fonts` (`id`, `font_name`) VALUES
(16, 'Debrosee-ALPnL.ttf'),
(18, 'OpenSans-Bold.ttf'),
(19, 'times.ttf'),
(23, 'Baby Girly.ttf');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `font_groups`
--
ALTER TABLE `font_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uploaded_fonts`
--
ALTER TABLE `uploaded_fonts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `font_groups`
--
ALTER TABLE `font_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `uploaded_fonts`
--
ALTER TABLE `uploaded_fonts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
