-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.11.0.7065
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para green-alert
CREATE DATABASE IF NOT EXISTS `green-alert` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `green-alert`;

-- Volcando estructura para tabla green-alert.evidencias
CREATE TABLE IF NOT EXISTS `evidencias` (
  `id_evidencia` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL DEFAULT (uuid()),
  `id_reporte` bigint unsigned NOT NULL,
  `id_usuario` bigint unsigned NOT NULL,
  `tipo_archivo` enum('imagen','video','audio','documento') NOT NULL,
  `url_archivo` varchar(1000) NOT NULL,
  `nombre_original` varchar(255) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `tamano_bytes` bigint unsigned NOT NULL,
  `hash_sha256` varchar(64) DEFAULT NULL,
  `metadatos_exif` json DEFAULT NULL,
  `ia_analisis` json DEFAULT NULL,
  `ia_procesado` tinyint NOT NULL DEFAULT '0',
  `verificado` tinyint NOT NULL DEFAULT '0',
  `orden` tinyint unsigned NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evidencia`),
  UNIQUE KEY `uq_evidencias_uuid` (`uuid`),
  KEY `idx_evidencias_reporte` (`id_reporte`),
  KEY `idx_evidencias_usuario` (`id_usuario`),
  KEY `idx_evidencias_tipo` (`tipo_archivo`),
  CONSTRAINT `fk_evidencias_reporte` FOREIGN KEY (`id_reporte`) REFERENCES `reportes` (`id_reporte`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_evidencias_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla green-alert.evidencias: ~0 rows (aproximadamente)

-- Volcando estructura para tabla green-alert.reportes
CREATE TABLE IF NOT EXISTS `reportes` (
  `id_reporte` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL DEFAULT (uuid()),
  `id_usuario` bigint unsigned NOT NULL,
  `tipo_contaminacion` enum('agua','aire','suelo','ruido','residuos','luminica','deforestacion','incendios_forestales','deslizamientos','avalanchas_fluviotorrenciales','otro') NOT NULL,
  `estado` enum('pendiente','en_revision','verificado','en_proceso','resuelto','rechazado') NOT NULL DEFAULT 'pendiente',
  `nivel_severidad` enum('bajo','medio','alto','critico') NOT NULL DEFAULT 'medio',
  `titulo` varchar(255) NOT NULL,
  `descripcion` text,
  `latitud` decimal(10,8) NOT NULL,
  `longitud` decimal(11,8) NOT NULL,
  `direccion` varchar(500) DEFAULT NULL,
  `municipio` varchar(150) DEFAULT NULL,
  `departamento` varchar(150) DEFAULT NULL,
  `ia_etiquetas` json DEFAULT NULL,
  `ia_confianza` decimal(5,4) DEFAULT NULL,
  `ia_procesado` tinyint NOT NULL DEFAULT '0',
  `votos_relevancia` int unsigned NOT NULL DEFAULT '0',
  `vistas` int unsigned NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  `punto_geo` point NOT NULL /*!80003 SRID 4326 */,
  PRIMARY KEY (`id_reporte`),
  UNIQUE KEY `uq_reportes_uuid` (`uuid`),
  KEY `idx_reportes_usuario` (`id_usuario`),
  KEY `idx_reportes_estado` (`estado`,`deleted_at`),
  KEY `idx_reportes_tipo` (`tipo_contaminacion`),
  KEY `idx_reportes_severidad` (`nivel_severidad`),
  KEY `idx_reportes_created` (`created_at`),
  KEY `idx_reportes_mapa` (`estado`,`tipo_contaminacion`,`nivel_severidad`),
  SPATIAL KEY `sidx_reportes_punto_geo` (`punto_geo`),
  CONSTRAINT `fk_reportes_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `reportes_chk_1` CHECK ((`latitud` between -(90) and 90)),
  CONSTRAINT `reportes_chk_2` CHECK ((`longitud` between -(180) and 180))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla green-alert.reportes: ~0 rows (aproximadamente)

-- Volcando estructura para tabla green-alert.usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id_usuario` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL DEFAULT (uuid()),
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `rol` enum('ciudadano','moderador','admin') NOT NULL DEFAULT 'ciudadano',
  `activo` tinyint NOT NULL DEFAULT '1',
  `email_verificado` tinyint NOT NULL DEFAULT '0',
  `avatar_url` varchar(500) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `token_reset` varchar(255) DEFAULT NULL,
  `token_reset_exp` datetime DEFAULT NULL,
  `ultimo_acceso` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `uq_usuarios_uuid` (`uuid`),
  UNIQUE KEY `uq_usuarios_email` (`email`),
  KEY `idx_usuarios_rol` (`rol`),
  KEY `idx_usuarios_activo` (`activo`,`deleted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla green-alert.usuarios: ~0 rows (aproximadamente)

-- Volcando estructura para disparador green-alert.trg_reportes_bi
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_reportes_bi` BEFORE INSERT ON `reportes` FOR EACH ROW BEGIN
  SET NEW.punto_geo = ST_SRID(Point(NEW.longitud, NEW.latitud), 4326);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador green-alert.trg_reportes_bu
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `trg_reportes_bu` BEFORE UPDATE ON `reportes` FOR EACH ROW BEGIN
  SET NEW.punto_geo = ST_SRID(Point(NEW.longitud, NEW.latitud), 4326);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
