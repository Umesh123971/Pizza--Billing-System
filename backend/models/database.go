// Add this function to handle DATABASE_URL from Render
func getDSN() string {
	// Check if DATABASE_URL is set (Render provides this)
	if dbURL := os.Getenv("DATABASE_URL"); dbURL != "" {
		return dbURL
	}

	// Fall back to individual environment variables (local development)
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	return fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		host, user, password, dbname, port)
}

func InitDB() {
	dsn := getDSN()
	// ...existing code...
}