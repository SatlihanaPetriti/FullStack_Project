import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    lastname: string;

    @Column()
    email: string;

    @OneToMany(() => UserEntity, user => user.orders)
    orders: UserEntity[];

    @Column()
    password: string;

    @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
    role: string;
    
    @Column({ type: 'varchar', nullable: true, default: null })
    resetToken?: string | null;
    
    @Column({ type: 'timestamp', nullable: true })
    resetTokenExpires?: Date | null;
}
