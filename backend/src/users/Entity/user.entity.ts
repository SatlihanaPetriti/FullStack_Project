import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('user')
export class UserEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: string;

    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpires?: Date | null;

}
