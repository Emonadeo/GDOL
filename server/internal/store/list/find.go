package list

import (
	"context"
	"database/sql"

	"github.com/emonadeo/gdol/internal/openapi"
	"github.com/emonadeo/gdol/internal/util"
	"github.com/lib/pq"
)

func (l List) Find(ctx context.Context) ([]openapi.Level, error) {
	// Cannot use sqlc because of https://github.com/kyleconroy/sqlc/issues/185
	rows, err := l.DB.QueryContext(ctx, "SELECT * FROM list")
	if err != nil {
		return nil, err
	}

	list := []openapi.Level{}

	for rows.Next() {
		var rank int16
		var id int64
		var name string
		var gdId sql.NullInt64
		var video sql.NullString
		var requirement sql.NullInt16
		var userId int64
		var userName string
		var userNationality sql.NullString
		var userDiscordId sql.NullString
		var verifierId int64
		var verifierName string
		var verifierNationality sql.NullString
		var verifierDiscordId sql.NullString
		var creatorsId []int64
		var creatorsName []string
		var creatorsNationality []sql.NullString
		var creatorsDiscordId []sql.NullString

		rows.Scan(
			&rank,
			&id,
			&name,
			&gdId,
			&video,
			&requirement,
			&userId,
			&userName,
			&userNationality,
			&userDiscordId,
			&verifierId,
			&verifierName,
			&verifierNationality,
			&verifierDiscordId,
			pq.Array(&creatorsId),
			pq.Array(&creatorsName),
			pq.Array(&creatorsNationality),
			pq.Array(&creatorsDiscordId),
		)

		creators := []openapi.User{}
		for i, id := range creatorsId {
			creators = append(creators, openapi.User{
				Id:          id,
				Name:        creatorsName[i],
				Nationality: util.NullString(creatorsNationality[i]),
			})
		}

		list = append(list, openapi.Level{
			Id:          id,
			Name:        name,
			GdId:        util.NullInt64(gdId),
			Video:       util.NullString(video),
			Requirement: util.NullInt16(requirement),
			User: openapi.User{
				Id:          userId,
				Name:        userName,
				Nationality: util.NullString(userNationality),
			},
			Verifier: openapi.User{
				Id:          verifierId,
				Name:        verifierName,
				Nationality: util.NullString(verifierNationality),
			},
			Creators: creators,
		})
	}
	return list, nil
}
