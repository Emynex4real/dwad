<?php

class Database
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo === null) {
            $db = Config::get()['db'];
            $port = $db['port'] ?? '3306';
            $dsn = "mysql:host={$db['host']};port={$port};dbname={$db['name']};charset=utf8mb4";

            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ];
            if (!empty($db['sslCa'])) {
                $options[PDO::MYSQL_ATTR_SSL_CA] = $db['sslCa'];
            }

            self::$pdo = new PDO($dsn, $db['user'], $db['pass'], $options);
        }

        return self::$pdo;
    }
}
