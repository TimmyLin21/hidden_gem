package utils

import "database/sql"

func ToNullFloat64(val *float64) sql.NullFloat64 {
	if val != nil {
		return sql.NullFloat64{Valid: true, Float64: *val}
	}
	return sql.NullFloat64{Valid: false}
}

func ToNullBool(val *bool) sql.NullBool {
	if val != nil {
		return sql.NullBool{Valid: true, Bool: *val}
	}
	return sql.NullBool{Valid: false}
}
