package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

//global variables
var database *sql.DB

func main() {

	//initialize db
	var err error
	database, err = initializeDatabase()
	if err != nil {
		log.Fatal("Database conn failed")
	}
	log.Println("Database conn successful")
	defer database.Close()

	//setup a router
	router := mux.NewRouter()

	//CORS fixes
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	origins := handlers.AllowedOrigins([]string{"*"})

	router.HandleFunc("/api/register", addUser).Methods("POST")
	router.HandleFunc("/api/login1", login1).Methods("POST")
	router.HandleFunc("/api/refresh", refresh).Methods("POST")
	router.HandleFunc("/api/reportAllFilesDetails", reportAllFilesDetails).Methods("GET")
	router.HandleFunc("/api/reportUserSubscriptionDetails", reportUserSubscriptionDetails).Methods("GET")

	//listen
	log.Fatal(http.ListenAndServe(":8082", handlers.CORS(headers, methods, origins)(router)))

}
