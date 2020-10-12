package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

//Initializing Database
func initializeDatabase() (*sql.DB, error) {
	//username:password@tcp(serverName)/dbname

	userName := "root"
	password := "Welcome@123"
	serverName := "localhost:3306"
	dbName := "rebbit_hub"

	connectionString := fmt.Sprintf("%s:%s@tcp(%s)/%s",
		userName, password, serverName, dbName)

	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		log.Println("Printing error...")
		return nil, err
	}
	return db, nil
}
