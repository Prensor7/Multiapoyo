export interface UserInterfaces {
    login: string | null;
    id: string | null;
    avatar_url: string | null;
    url: string | null;
    html_url: string | null;
    received_events_url: string | null;
    type: string | null;
    user_view_type: string | null;
    site_admin: string | null;
    score: string | null;
}


export interface UserInfoInterfaces {
    login: string | null;
    id: number | null;
    avatar_url: string | null;
    public_repos: number | null;
    public_gists: number | null;
    followers: number | null;
    following: number | null;
    created_at: Date | null;
}