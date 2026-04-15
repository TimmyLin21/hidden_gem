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

func ToNullString(val *string) sql.NullString {
	if val != nil {
		return sql.NullString{Valid: true, String: *val}
	}
	return sql.NullString{Valid: false}
}

func ToNullInt32(val *int32) sql.NullInt32 {
	if val != nil {
		return sql.NullInt32{Valid: true, Int32: *val}
	}
	return sql.NullInt32{Valid: false}
}

func HaveValueOverlap[T comparable](s1, s2 []T) bool {
	// Put the smaller slice into the map for slightly better performance
	if len(s1) > len(s2) {
		s1, s2 = s2, s1
	}
	set := make(map[T]struct{})
	for _, item := range s1 {
		// empty struct{} takes zero bytes, so it is better than using boolean
		set[item] = struct{}{}
	}
	for _, item := range s2 {
		if _, exists := set[item]; exists {
			return true
		}
	}
	return false
}
