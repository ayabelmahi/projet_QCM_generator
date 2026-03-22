<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260321235110 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE attempt_answer (id INT AUTO_INCREMENT NOT NULL, is_correct TINYINT NOT NULL, answered_at DATETIME NOT NULL, attempt_id INT NOT NULL, question_id INT NOT NULL, choice_id INT NOT NULL, INDEX IDX_FEC920DCB191BE6B (attempt_id), INDEX IDX_FEC920DC1E27F6BF (question_id), INDEX IDX_FEC920DC998666D1 (choice_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE qcm_attempt (id INT AUTO_INCREMENT NOT NULL, candidate_email VARCHAR(255) DEFAULT NULL, candidate_name VARCHAR(255) DEFAULT NULL, started_at DATETIME NOT NULL, submitted_at DATETIME DEFAULT NULL, duration_seconds INT DEFAULT NULL, score INT DEFAULT NULL, passed TINYINT DEFAULT NULL, status VARCHAR(255) NOT NULL, qcm_id INT NOT NULL, version_id INT NOT NULL, invitation_id INT NOT NULL, INDEX IDX_CA51D92DFF6241A6 (qcm_id), INDEX IDX_CA51D92D4BBC2705 (version_id), INDEX IDX_CA51D92DA35D7AF0 (invitation_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE qcm_invitation (id INT AUTO_INCREMENT NOT NULL, token VARCHAR(64) NOT NULL, candidate_email VARCHAR(255) DEFAULT NULL, candidate_name VARCHAR(255) DEFAULT NULL, status VARCHAR(255) NOT NULL, expires_at DATETIME DEFAULT NULL, created_at DATETIME NOT NULL, qcm_id INT NOT NULL, version_id INT NOT NULL, INDEX IDX_5ACED0B4FF6241A6 (qcm_id), INDEX IDX_5ACED0B44BBC2705 (version_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE qcm_version (id INT AUTO_INCREMENT NOT NULL, version_number INT NOT NULL, public_id VARCHAR(64) NOT NULL, shuffle_seed VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, qcm_id INT NOT NULL, INDEX IDX_6DA10888FF6241A6 (qcm_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE attempt_answer ADD CONSTRAINT FK_FEC920DCB191BE6B FOREIGN KEY (attempt_id) REFERENCES qcm_attempt (id)');
        $this->addSql('ALTER TABLE attempt_answer ADD CONSTRAINT FK_FEC920DC1E27F6BF FOREIGN KEY (question_id) REFERENCES question (id)');
        $this->addSql('ALTER TABLE attempt_answer ADD CONSTRAINT FK_FEC920DC998666D1 FOREIGN KEY (choice_id) REFERENCES choice (id)');
        $this->addSql('ALTER TABLE qcm_attempt ADD CONSTRAINT FK_CA51D92DFF6241A6 FOREIGN KEY (qcm_id) REFERENCES qcm (id)');
        $this->addSql('ALTER TABLE qcm_attempt ADD CONSTRAINT FK_CA51D92D4BBC2705 FOREIGN KEY (version_id) REFERENCES qcm_version (id)');
        $this->addSql('ALTER TABLE qcm_attempt ADD CONSTRAINT FK_CA51D92DA35D7AF0 FOREIGN KEY (invitation_id) REFERENCES qcm_invitation (id)');
        $this->addSql('ALTER TABLE qcm_invitation ADD CONSTRAINT FK_5ACED0B4FF6241A6 FOREIGN KEY (qcm_id) REFERENCES qcm (id)');
        $this->addSql('ALTER TABLE qcm_invitation ADD CONSTRAINT FK_5ACED0B44BBC2705 FOREIGN KEY (version_id) REFERENCES qcm_version (id)');
        $this->addSql('ALTER TABLE qcm_version ADD CONSTRAINT FK_6DA10888FF6241A6 FOREIGN KEY (qcm_id) REFERENCES qcm (id)');
        $this->addSql('ALTER TABLE qcm ADD versions_count INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE attempt_answer DROP FOREIGN KEY FK_FEC920DCB191BE6B');
        $this->addSql('ALTER TABLE attempt_answer DROP FOREIGN KEY FK_FEC920DC1E27F6BF');
        $this->addSql('ALTER TABLE attempt_answer DROP FOREIGN KEY FK_FEC920DC998666D1');
        $this->addSql('ALTER TABLE qcm_attempt DROP FOREIGN KEY FK_CA51D92DFF6241A6');
        $this->addSql('ALTER TABLE qcm_attempt DROP FOREIGN KEY FK_CA51D92D4BBC2705');
        $this->addSql('ALTER TABLE qcm_attempt DROP FOREIGN KEY FK_CA51D92DA35D7AF0');
        $this->addSql('ALTER TABLE qcm_invitation DROP FOREIGN KEY FK_5ACED0B4FF6241A6');
        $this->addSql('ALTER TABLE qcm_invitation DROP FOREIGN KEY FK_5ACED0B44BBC2705');
        $this->addSql('ALTER TABLE qcm_version DROP FOREIGN KEY FK_6DA10888FF6241A6');
        $this->addSql('DROP TABLE attempt_answer');
        $this->addSql('DROP TABLE qcm_attempt');
        $this->addSql('DROP TABLE qcm_invitation');
        $this->addSql('DROP TABLE qcm_version');
        $this->addSql('ALTER TABLE qcm DROP versions_count');
    }
}
