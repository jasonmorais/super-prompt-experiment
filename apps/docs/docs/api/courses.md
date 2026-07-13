---
sidebar_position: 2
---

# Course Catalog API

Search and paginate the training course catalog.

## Request

```http
GET /api/courses?q=security&modality=online&status=active&tag=ai&page=1&pageSize=5&sort=title
```

## Query parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Case-insensitive keyword search across title, summary, and tags |
| `modality` | string | No | Filter by `online`, `in-person`, or `hybrid` |
| `status` | string | No | Filter by `draft`, `active`, or `retired` |
| `tag` | string | No | Filter to courses containing the supplied tag (case-insensitive) |
| `page` | integer | No | Page number, defaults to `1` |
| `pageSize` | integer | No | Page size, defaults to `10` and must be between `1` and `50` |
| `sort` | string | No | Sort field, one of `title`, `createdAt`, or `updatedAt` |

## Success response

**Status:** `200 OK`

```json
{
  "items": [
    {
      "id": "course-001",
      "title": "AI Security Foundations",
      "summary": "Introductory course on secure AI-assisted development.",
      "modality": "online",
      "status": "active",
      "tags": ["ai", "security"],
      "createdAt": "2026-01-15T00:00:00.000Z",
      "updatedAt": "2026-06-01T00:00:00.000Z"
    }
  ],
  "page": 1,
  "pageSize": 5,
  "totalItems": 1,
  "totalPages": 1
}
```

## Error response

**Status:** `400 Bad Request`

```json
{
  "error": {
    "code": "INVALID_QUERY_PARAMETER",
    "message": "One or more query parameters are invalid.",
    "details": [
      {
        "field": "pageSize",
        "message": "pageSize must be between 1 and 50."
      }
    ]
  }
}
```
