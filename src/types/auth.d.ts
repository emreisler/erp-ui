export interface LoginUserRequest {
    username: string;
    password: string;
}

export interface LoginUserResponse {
    token: string;
}

export interface RegisterUserRequest {
    username: string;
    password: string;
    email: string;
    role?: string; // Optional, defaults to "user"
}

export interface RegisterUserResponse {
    id: number;
    username: string;
    email: string;
    role: string;
}
