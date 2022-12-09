package list

import (
	"database/sql"

	"github.com/emonadeo/gdol/generated/sqlc"
	"github.com/emonadeo/gdol/internal/store/list/settings"
)

type List struct {
	DB  *sql.DB
	Qry *sqlc.Queries

	Settings *settings.Settings
}

func New(db *sql.DB, qry *sqlc.Queries) *List {
	return &List{
		DB:  db,
		Qry: qry,

		Settings: settings.New(),
	}
}
