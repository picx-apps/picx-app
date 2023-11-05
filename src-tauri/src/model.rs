use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct User {
    pub login: Option<String>,
    pub id: Option<u32>,
    pub node_id: Option<String>,
    pub avatar_url: Option<String>,
    pub gravatar_id: Option<String>,
    pub url: Option<String>,
    pub html_url: Option<String>,
    pub followers_url: Option<String>,
    pub following_url: Option<String>,
    pub gists_url: Option<String>,
    pub starred_url: Option<String>,
    pub subscriptions_url: Option<String>,
    pub organizations_url: Option<String>,
    pub repos_url: Option<String>,
    pub events_url: Option<String>,
    pub received_events_url: Option<String>,
    pub r#type: Option<String>,
    pub site_admin: Option<bool>,
    pub name: Option<String>,
    pub company: Option<String>,
    pub blog: Option<String>,
    pub location: Option<String>,
    pub email: Option<String>,
    pub hireable: Option<bool>,
    pub bio: Option<String>,
    pub twitter_username: Option<String>,
    pub public_repos: Option<u32>,
    pub public_gists: Option<u32>,
    pub followers: Option<u32>,
    pub following: Option<u32>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
    pub private_gists: Option<u32>,
    pub total_private_repos: Option<u32>,
    pub owned_private_repos: Option<u32>,
    pub disk_usage: Option<u32>,
    pub collaborators: Option<u32>,
    pub two_factor_authentication: Option<bool>,
    pub plan: Option<Plan>,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Plan {
    pub name: Option<String>,
    pub space: Option<u32>,
    pub private_repos: Option<u32>,
    pub collaborators: Option<u32>,
}

#[derive(Deserialize, Serialize, Debug, Default)]
pub struct AuthConfig {
    pub code: String,
    pub client_id: String,
    pub client_secret: String,
    pub redirect_uri: String,
    pub state: String,
}

#[derive(Deserialize, Serialize, Debug, Default, Clone)]
pub struct UserToken {
    pub access_token: Option<String>,
    pub scope: Option<String>,
    pub token_type: Option<String>,
}
